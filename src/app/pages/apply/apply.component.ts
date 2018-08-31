import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material';
import { ContentService, CanPageDeactivate, UserProfile, ProjectService, wmApplication, wmProject } from '../../core';
import { ToolbarService, ActionEnabler } from '../../navigator';
import { PopupService } from '../../shared';
import { TermsPrivacyPopupComponent } from '../terms-privacy/terms-privacy-popup.component';
import { $animations } from './apply.animations';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators'

@Component({
  selector: 'wm-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
  animations: $animations
})
export class ApplyComponent implements OnInit, AfterViewInit, CanPageDeactivate {

  public headerForm: FormGroup;
  public stepForms : FormGroup[] = [];
  public stepIndex = 0;
  public welcomeBack = false;
  public progress = false;
  public msgs;

  constructor(private builder : FormBuilder, 
              private router  : Router,
              private route   : ActivatedRoute,
              private http    : HttpClient,
              private content : ContentService,
              private user    : UserProfile,
              private project : ProjectService,
              private toolbar : ToolbarService,
              private popup   : PopupService) { 

    // Gets the localized user messages from content manager
    this.msgs = this.content.select('apply');
  }

  private enableClear$: ActionEnabler;

  ngOnInit() {

    // Checks if the application was previously saved
    this.welcomeBack = this.application !== null;

    // Build the stepper forms initializing the field values with the last application eventually saved
    this.buildForm(this.application || {});

    // Enable actions on the navigation bar
    this.toolbar.activateActions(this.msgs.actions)
      .subscribe( code => this.disclaimerAction(code) );

    // Gets the action enabler for 'clear' action code
    this.enableClear$ = this.toolbar.actionEnabler('clear');
    this.enableClear$.enable(this.application !== null);
  }

  ngAfterViewInit() {

    // Walk trough the saved application steps
    //this.stepIndex = this.application ? this.walkTrought() : 0;

  }

  // Helpers to deal with the temporary application 
  private get application(): wmApplication {
    return this.user.lastApplication || null;
  }

  private resetApplication(): Promise<void> { 
    return this.saveApplication(null);
  }

  // Updates the last saved application
  private saveApplication(value: any): Promise<void> {
    return this.user.update( { lastApplication: value })
      // Enables/ Disables the 'clear' action button accordingly
      .then(() => this.enableClear$.enable( value != null ) )
      .catch(error => console.log("something wrong: " + error.code) );
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
    
    // Returns a validator function async checking if the project name
    // already exists
    return (control: AbstractControl): Promise<{[key: string]: any} | null> => {
      
      let name: string = control.value;
      return this.project.doesProjectExists( name.trim() )
        .then( r => r ? { alreadyExist: true } : null , e => e );
    };
  }

  private buildForm(value?: any) {

    // Creates the form group for the application name with:
    // a sync validator 'required'
    // an async validator to check for projects with the same name
    this.headerForm = this.builder.group({
      name: [ value.name, Validators.required, this.projectNameValidator ],
      pitch: [ value.pitch, Validators.required ]
    });

    // Loops on the application questions to build the relevant form group and controls
    this.msgs.questions.forEach(question => {
      
      let group: any = {};

      // Build the group's controls
      question.fields.forEach( field => {

        // Only required validator is supported
        let required = field.errors && field.errors.required;

        group[field.name] = new FormControl( value[field.name], required ? Validators.required : null);
      });

      // Push the form group into the array
      this.stepForms.push( new FormGroup(group) );
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

  private loadTemplate(path: string): Observable<string> {
    
    // Loads the MD template file from the given path
    return this.http.get(path, { responseType: 'text' } )
      .pipe( catchError( e => {
        console.error(e);
        return "# Something wrong"; 
      }));
  }

  // Creates a project instance starting from the given application
  private createProject(application: wmApplication): Promise<string> {

    // Gets the document localized contents
    let doc = this.content.select('document');

    // Load the document template
    return doc ? this.loadTemplate(doc.template)
      .pipe( switchMap( template => { 

        // Build a context object combining the given application, 
        // containing the user answers given during the application 
        // proces, and the localized comments
        let context = { ...doc, application };

        // Store a new project creating the content from the applicaton
        return this.project.addProject( {

          status: 'draft',

          // Project name inherited from the applciation
          name: application.name,
          
          // Elevator pitch inherited from the applciation
          pitch: application.pitch,
          
          // Document created from the template and the given application 
          document: template.replace(/<\s*([\w.]+)\s*>/g, (_, selector) => {
            
            // Replaces the <comma.separated.selectors> found into the template 
            // with the content coming from the context object
            return (selector.select(context) || selector).interpolate(context);
          })

        } as wmProject );

      })).toPromise() : Promise.reject('project/missingTemplate');
  }

  public submitProject() {
    
    console.log('done');

    // Shows the progress
    this.progress = true;

    // Create a new project from the temporary application
    this.createProject( this.application )
      .then( id => {
        
        console.log("project submitted: ", id);
        this.progress = false;

        // Clear the temp application
        return this.resetApplication();
      })
      .then( () => { 
      
        // Navigate back to the project browser reporting the creation of a new project
        this.router.navigate(['..', 'projects'], {
          relativeTo: this.route,
          queryParams: {
            project: 'new'
          }
        })
      })
      .catch(error => {

        console.log("something wrong: " + error.code);
        this.progress = false;
      });
  }

  public disclaimerAction(action: string) {

    switch(action) {

      // Pops up the terms-privacy conditions without leaving the page
      case 'terms':
      
      this.popup.open(TermsPrivacyPopupComponent);
      break;

      // Clears the forrm and the previously saved application to start from 
      case 'clear':
      
      this.popup.confirmPopup(this.msgs.canClear)
        .subscribe( () => this.clearApplication() );
      break;

      default:
      console.error('Unexpected action code', action);
      break;
    }
  }

  public canDeactivate() {

    // Enable deactivation (leaving the page) in case no appliaction has been created yet or the user agrees when asked (popup)
    return !this.application || this.popup.popupDialog(this.msgs.canLeave);
  }
}

