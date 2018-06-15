import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
//import {ErrorStateMatcher} from '@angular/material/core';
import { ContentManager } from 'app/content';
import { MailerliteService, mlFormFields } from 'app/utils/mailerlite' 

@Component({
  selector: 'wm-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  // Move mlStuff in content
  private mlAction = 'u8y1i2';

  private form: FormGroup;
  private result: string = '';
  private msgs;  
  
  constructor(private builder: FormBuilder,
              private content: ContentManager,
              private ml: MailerliteService) { }

    
  ngOnInit() {

    // Gets the localized user messages from content manager
    this.msgs = this.content.select('apply');

    this.form = this.builder.group({
      email: ['', Validators.compose([ Validators.required, Validators.email ]) ],
    });
  }

  private onSubmit() : void {

    // Prepare the list of form-fields
    let fields: mlFormFields[] = [
    {
      field: 'email',
      value: this.form.controls.email.value
    }];

    this.result = 'progress';// Show the progress

    // Post the for to Mailerlite
    this.ml.postForm(this.mlAction,fields).then( msg => {

      console.log('subscribe: ' + msg );

      this.result = 'success';// Shows the success on completion      
      this.form.reset();

    }).catch( () => {

      this.result = 'error';// Shows the error
    });
  }
}
