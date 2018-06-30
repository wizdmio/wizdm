import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl} from '@angular/forms';
import { ContentManager, CanPageDeactivate, ProjectService, wmProject } from 'app/core';
//import { MatStepper } from '@angular/material';
//import { Observable, of, timer } from 'rxjs';
//import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'wm-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit, CanPageDeactivate {

  private stepForms: FormGroup[] = new Array;
  private nameForm: FormGroup;
  private progress = false;
  private msgs;  

  constructor(private builder: FormBuilder,
              private content: ContentManager,
              private project: ProjectService) { }

  ngOnInit() {

    // Gets the localized user messages from content manager
    this.msgs = this.content.select('apply');
    
    this.buildForm();
    this.draftProject();
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
      appname: ['', Validators.required, this.projectNameValidator ]
    });

    // Loops on the application questions to build the 
    // relevant form group and controls
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

  private draftProject() {

    // Creates the new project with no information but the status
    this.project.addProject({ status: 'draft' } as wmProject)
      .then(result => {

        console.log("project created");
        
      }).catch(error => {

        console.log("something wrong: " + error.code);

      });
  }

  private renameProject() {

    // Assign the given name to the application
    // NOTE: name existance was already checked by a custom
    // async validator on the form control
    let name = this.nameForm.controls.appname.value;

    this.project.renameProject(name)
      .then(() => {
        
        console.log("project updated");

      }).catch(error => {

        console.log("something wrong: " + error.code);

      });
  }

  private updateApplication(step: number) {

    let value = this.stepForms[step].value;

    console.log("step: " + JSON.stringify(value));

    this.project.updateProject({ application: {...value}} as wmProject)
      .then(() => {
        
        console.log("project updated");

      }).catch(error => {

        console.log("something wrong: " + error.code);

      });
  }

  private submitProject() {
    
    console.log('done');

    // Shows the progress
    this.progress = true;

    this.project.updateProject({ status: 'submitted' } as wmProject)
      .then(() => {
        
        console.log("project submitted");
        this.progress = false;

        //TODO: Jump tp the dashboard with newproject message

      }).catch(error => {

        console.log("something wrong: " + error.code);
        this.progress = false;
      });
  }

  public canDeactivate() {
    console.log("Apply#canDeactivate()");
    return true;
  }
}
