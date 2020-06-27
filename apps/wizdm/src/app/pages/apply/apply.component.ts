import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { UserProfile, UserData } from 'app/utils/user-profile';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { EditableConverter } from 'app/utils/doc-converter';
import { HttpErrorResponse } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';
import { ProjectService } from './project.service';
import { $animations } from './apply.animations';
import { ContentStreamer } from '@wizdm/content';
import { RedirectService } from '@wizdm/redirect';
import { Observable, Subscription } from 'rxjs';
import { wmDocument } from '@wizdm/editable';


export interface wmApplication {

  name?          : string, // Application name
  pitch?         : string, // Elevator pitch
  description?   : string, // Background description
  players?       : string, // Other similar players
  differences?   : string, // Uniquenesses
  users?         : string, // Target users
  target?        : string, // Target market (geo, ...)
  revenues?      : string, // Revenue streams
  comments?      : string  // Additional comments
}

interface userApply extends UserData {
  lastApplication?: wmApplication,
}

@Component({
  selector: 'wm-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
  animations: $animations,
  providers: [ ContentStreamer ]
})
export class ApplyComponent implements AfterViewInit, OnDestroy {

  private sub: Subscription;

  public headerForm: FormGroup;
  public stepForms : FormGroup[] = [];
  public stepIndex = 0;
  public welcomeBack = false;
  public progress = false;
  
  constructor(private builder   : FormBuilder, 
              private profile   : UserProfile<userApply>,
              private converter : EditableConverter,
              private project   : ProjectService,
              private redirect  : RedirectService,
              private content   : ContentStreamer) {

    // Checks if the application was previously saved
    this.welcomeBack = !!this.application;  

    this.buildForm(this.application || {});
  }

  ngAfterViewInit() {

    // Walk trough the saved application steps
    //this.stepIndex = this.application ? this.walkTrought() : 0;
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  // Helpers to deal with the temporary application 
  public get application(): wmApplication {
    return this.profile.data.lastApplication || null;
  }

  private resetApplication() { //}: Promise<void> { 
    return this.saveApplication(null);
  }

  // Updates the last saved application
  private saveApplication(value: any) { //}: Promise<void> {

    const lastApplication = !!value ? {
      ...this.application,
      ...value
    } : null;
    
    return this.profile.update({ lastApplication })
      // Enables/Disables the 'clear' action button accordingly
      //.then(() => this.enableActions = { ...this.enableActions, clear: value != null } ) 
      // Catches errors
      //.catch(error => console.log("something wrong: " + error.code) );
  }

  @ViewChild('stepper') stepper: MatStepper;

  public clearApplication() {

    // Clear the welcomeBack flag
    this.welcomeBack = false;

    // Resets the stepper (and the forms)
    this.stepper.reset();

    // Resets the forms (resetted by the stepper)
    //this.headerForm.reset();
    //this.stepForms.forEach( step => step.reset() ); 

    // Resets the previously saved application data
    return this.resetApplication();
  }

  public errorMessage(controlErrors: any, errorMessages: any): string {
    
    // Evaluates the validation reported errors
    let codes = Object.keys(controlErrors);
    
    // Returns the relevant error message
    return errorMessages && codes ? errorMessages[codes[0]] : '';
  }

  // Project Name Validator Factory 
  get projectNameValidator() {
    
    // Returns a validator function async checking if the project name already exists
    return (control: AbstractControl): Promise<{[key: string]: any} | null> => {
      
      return this.project.doesProjectExists( control.value )
        .then( r => r ? { alreadyExist: true } : null , e => e );
    };
  }

  private buildForm(value: any = {}) {

    // Creates the form group for the application name with:
    // a sync validator 'required'
    // an async validator to check for projects with the same name
    this.headerForm = this.builder.group({
      name: [ value.name || '', Validators.required, this.projectNameValidator ],
      pitch: [ value.pitch || '', Validators.required ]
    });

    this.sub = this.content.stream('apply.questions').subscribe( (questions: any[]) => {

      // Loops on the application questions to build the relevant form group and controls
      questions.forEach(question => {
      
        let group: any = {};

        // Build the group's controls
        question.fields.forEach( field => {

          // Only required validator is supported
          const required = field.errors && field.errors.required;
          group[field.name] = new FormControl( value[field.name], required ? Validators.required : null);
        });

        // Push the form group into the array
        this.stepForms.push( new FormGroup(group) );
      });
    });
  }
  
  private walkTrought(): number {

    return this.headerForm.valid && this.headerForm.value ? 
      (1 + this.stepForms.findIndex( form => 
        form.valid && form.value)) : 0;
  }

  public draftApplication() {

    // Proceed only upon proper name validation
    if(this.headerForm.invalid) {

      console.log('Invalid header, skipping...');
      return;
    }

    // Saves the temporary application in the user profile 
    this.saveApplication( this.headerForm.value );
  }

  public updateApplication(step: number) {

    // Check for form validation results
    if(this.stepForms[step].invalid) {

      console.log('Invalid application data, skipping to update');
      return;
    }

    // Update the project's application application 
    let value = this.stepForms[step].value;

    console.log("step: " + JSON.stringify(value));

    // Keep saving the temporary application in the user profile 
    this.saveApplication( value );
  }

  private buildTemplate(lang: string, context: wmApplication): Observable<wmDocument> {

    const defaultLang = 'en';

    return this.converter.loadMarkdown(`assets/docs/${lang}/template.md`, context).pipe(
      // Catches the possible error
      catchError( (e: HttpErrorResponse) => {
        // On file not found (404) of localized content...
        if(lang !== defaultLang && e.status === 404) { 
          
          const defaultPath = `assets/docs/${defaultLang}/template.md`;
          
          console.log('404 File not found, reverting to default language:', defaultPath);
          
          // Loads the same document in the default language instead
          return this.converter.loadMarkdown(defaultPath, context);
        }
      })
    );
  }

  // Creates a project instance starting from the given application
  private applyProject(application: wmApplication) {

    // Builds the template in the current language with the given application
    return this.buildTemplate(this.content.language, application).pipe(

      switchMap( template => {

        return this.project.addProject( {
          // Document content coming from the template
          ...template,
          // Assigns the current user as the author
          author: this.profile.id,
          // Gets the project name from the application
          name: application.name,
          // Adds the elevator pitch
          pitch: application.pitch
        });
      })

    ).toPromise();
  }

  public submitProject() {
    
    console.log('done');

    // Shows the progress
    this.progress = true;

    // Create a new project from the temporary application
    this.applyProject( this.application )
      .then( id => {
        
        console.log("project submitted: ", id);
        this.progress = false;

        // Clear the temp application
        return this.resetApplication();
      })
      .then( () => { 

        // Navigate back to the project explore reporting the creation of a new project
        this.redirect.navigate('explore?project=new');
      })
      .catch(error => {

        console.log("something wrong: " + error.code);
        this.progress = false;
      });
  }
}

