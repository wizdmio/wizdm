import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ContentManager, CanPageDeactivate, ProjectService, wmProject } from 'app/core';
import { PopupComponent } from 'app/shared/popup/popup.component';
import { TermsPrivacyPopupComponent } from 'app/pages/terms-privacy/terms-privacy-popup.component';
import { map, take, tap, debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wm-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit, OnDestroy, CanPageDeactivate {

  private stepForms: FormGroup[] = new Array();
  private nameForm: FormGroup;
  private progress = false;
  private msgs;

  //private newProject = false;
  //private subNav: Subscription;

  constructor(private builder: FormBuilder, 
              private router:  Router,
              private route:   ActivatedRoute,
              private content: ContentManager,
              private project: ProjectService,
              private dialog:  MatDialog) { }

  ngOnInit() {

    // Gets the localized user messages from content manager
    this.msgs = this.content.select('apply');

    // Build the stepper forms
    this.buildForm();
    this.draftProject();
/*
    // Check for action codes
    this.subNav = this.route.queryParamMap.subscribe( (params: ParamMap) => {

      let projectId = params.get('project');

      // New project flag to show the appropriate messages
      this.newProject = projectId == null;

      // If a project id was specified...
      if(projectId !== null) {

        // Load the requested project data
        this.loadProject(projectId);
        console.log('Modify the application of: ' + projectId);
      }
      else { //...if not

        // Create a new empty draft
        this.draftProject();
        console.log('New application');
      }
    });
    */
  }

  ngOnDestroy() {
    //this.subNav.unsubscribe();
  }

  // Returns true if there are chnces to be saved
  private get saveChanges(): boolean {
    
    return this.nameForm.dirty || 
           this.stepForms.some( form => form.dirty);
  }
  
  // Project Name Validator Factory 
  get projectNameValidator() {
    
    // Returns a validator function async checking if the project name
    // already exists
    return (control: AbstractControl): Promise<{[key: string]: any} | null> => {
      
      return this.project.doesProjectExists(control.value)
        .then( r => r ? { alreadyExist: true } : null , e => e );
    };
  }

  private buildForm() {
    // Creates the form group for the application name with:
    // a sync validator 'required'
    // an async validator to check for projects with the same name
    this.nameForm = this.builder.group({
      name: ['', Validators.required, this.projectNameValidator ]
    });

    // Loops on the application questions to build the relevant form group and controls
    this.msgs.questions.forEach(question => {
      
      let group: any = {};

      // Build the group's controls
      question.fields.forEach( field => {
        group[field.name] = new FormControl('', field.required ? Validators.required : null);
      });

      // Push the form group into the array
      this.stepForms.push( new FormGroup(group) );
    });
  }

  private loadProject(id: string) {

    this.project.queryProject(id).pipe( 
      take(1),
      tap( (data: wmProject) => {

        // Fill out the project name form
        this.nameForm.patchValue({ name: data.name } );
        
        // Loops on form group steps
        this.msgs.questions.forEach( (question, index) => { 
          this.stepForms[index].patchValue( data.application );
        });
      })
    ).subscribe();
  }

  private draftProject() {

    // Creates the new project with no information but the status 'draft'
    this.project.addProject({ status: 'draft' } as wmProject)
      .then(result => {

        console.log("project created");
        
      }).catch(error => {

        console.log("something wrong: " + error.code);

      });
  }

  private renameProject() {

    // Proceed only upon proper name validation
    if(this.nameForm.invalid) {

      console.log('Invalid project name, skipping to update');
      return;
    }

    let name = this.nameForm.controls.name.value;

    // Update the draft project with the requeted name
    this.project.renameProject(name)
      .then(() => {
        
        console.log("project updated");
        this.nameForm.markAsPristine();

      }).catch(error => {

        console.log("something wrong: " + error.code);

      });
  }

  private updateApplication(step: number) {

    // Check for form validation results
    if(this.stepForms[step].invalid) {

      console.log('Invalid application data, skipping to update');
      return;
    }

    // Update the project's application application 
    let value = this.stepForms[step].value;

    console.log("step: " + JSON.stringify(value));

    this.project.updateApplication(value)
      .then(() => {
        
        console.log("application updated");
        this.stepForms[step].markAsPristine();

      }).catch(error => {

        console.log("something wrong: " + error.code);

      });
  }

  private submitProject() {
    
    console.log('done');

    // Shows the progress
    this.progress = true;

    // At this point submitting a project means simply turn its status into 'submitted'
    // since the relevant project and application data has been saved along the steps
    this.project.updateProject({ status: 'submitted' } as wmProject)
      .then(() => {
        
        console.log("project submitted");
        this.progress = false;

        // Navigate back to the dashboard reporting the creation of a new project
        this.router.navigate(['..', 'dashboard'], {
          relativeTo: this.route,
          queryParams: {
            project: 'new'
          }
        });

      }).catch(error => {

        console.log("something wrong: " + error.code);
        this.progress = false;
      });
  }

  public canDeactivate() {

    // If there are no data changes
    if(!this.saveChanges) {

      // Delete the empty project and agree to leave
      //if(this.newProject) {
        this.project.deleteProject();
      //}
      return true;
    }

    // Otherwise, popup asking for a confirmation to leave
    return this.dialog.open(PopupComponent, { 
        data: this.msgs.canLeave,
        maxWidth: 500,
      })
      .afterClosed()
      .toPromise();
  }

  private popupTerms() {

    // Pops up the terms-privacy conditions without leaving the page
    this.dialog.open(TermsPrivacyPopupComponent);
  }
}
