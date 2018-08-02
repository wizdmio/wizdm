import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ContentService, CanPageDeactivate, AuthService, ProjectService } from 'app/core';
import { PopupComponent } from 'app/shared';
import { TermsPrivacyPopupComponent } from '../terms-privacy/terms-privacy-popup.component';

@Component({
  selector: 'wm-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit, CanPageDeactivate {

  public headerForm: FormGroup;
  public stepForms : FormGroup[] = [];
  public progress = false;
  public msgs;

  constructor(private builder : FormBuilder, 
              private router  : Router,
              private route   : ActivatedRoute,
              private content : ContentService,
              private auth    : AuthService,
              private project : ProjectService,
              private dialog  :  MatDialog) { }

  ngOnInit() {

    // Gets the localized user messages from content manager
    this.msgs = this.content.select('apply');

    // Build the stepper forms initializing the field values with the last application eventually saved
    this.buildForm(this.application || {});
  }

  // Helpers to deal with the temporary application 
  private get application() {
    return this.auth.userProfile['lastApplication'];
  }

  private resetApplication(): Promise<void> { 
    return this.saveApplication(null);
  }

  private saveApplication(value: any): Promise<void> {
    return this.auth.updateUserProfile( { lastApplication: value })
      .then(() => console.log("application updated") )
      .catch(error => console.log("something wrong: " + error.code) );
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

  public submitProject() {
    
    console.log('done');

    // Shows the progress
    this.progress = true;

    // Create a new project from the temporary application
    this.project.createProject( this.application )
      .then(() => {
        
        console.log("project submitted");
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

  public popupTerms() {

    // Pops up the terms-privacy conditions without leaving the page
    this.dialog.open(TermsPrivacyPopupComponent);
  }

  public canDeactivate() {

    // Enable deactivation (leaving the page) in case no appliaction has been created yet or the user agrees when asked (popup)
    return !this.application || this.dialog.open(PopupComponent, { 
        data: this.msgs.canLeave,
        maxWidth: 500,
      }).afterClosed();
  }
}

