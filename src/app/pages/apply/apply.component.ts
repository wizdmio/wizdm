import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl} from '@angular/forms';
import { ContentManager } from 'app/core';

@Component({
  selector: 'wm-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  private nameForm: FormGroup;
  private stepForms: FormGroup[] = new Array;
  private msgs;  
  
  constructor(private builder: FormBuilder,
              private content: ContentManager) { }

  ngOnInit() {

    // Gets the localized user messages from content manager
    this.msgs = this.content.select('apply');

    this.nameForm = this.builder.group({
      appname: ['', Validators.required ]
    });

    this.msgs.questions.forEach(question => {
      
      let group: any = {};

      question.fields.forEach( field => {

        group[field.name] = new FormControl('', field.required ? Validators.required : null);

      });

      this.stepForms.push( new FormGroup(group) );
    });

    console.log("done");
  }

  private onSubmit() : void {
  }
}
