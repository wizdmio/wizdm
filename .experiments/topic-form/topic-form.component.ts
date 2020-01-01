import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@wizdm/elements/dialog';
import { wmTopic } from '../topic-item/topic-item.component';

@Component({
  selector: 'wm-topic-form',
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.scss']
})
export class TopicForm extends DialogComponent<wmTopic> implements OnInit {

  public form: FormGroup;

  constructor(private builder: FormBuilder, dialog: MatDialog) {
    super(dialog);
  }

  @Input() data: wmTopic;

  ngOnInit() {

    this.form = this.builder.group({
      'name' : [ this.data.name || '', [ Validators.required, Validators.minLength(3) ]/*, this.projectNameValidator*/ ],
      'pitch': [ this.data.pitch || '', Validators.required ],
      'web'  : [ this.data.web || '' ]
    });
  }

  // Project Name Validator Factory 
  /*get projectNameValidator() {
    
    // Returns a validator function async checking if the project name already exists
    return (control: AbstractControl): Promise<{[key: string]: any} | null> => {

      return control.value != this.name ? this.ps.doesProjectExists( control.value )
        .then( r => r ? { exists: true } : null ) : Promise.resolve(null);
    };
  }*/
}
