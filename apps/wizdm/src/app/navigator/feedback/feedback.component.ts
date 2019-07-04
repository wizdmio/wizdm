import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DoorbellService } from '@wizdm/doorbell';
import { ContentResolver } from '../../core';
import { Observable, Subscription } from 'rxjs';

export interface DorbellSubmit {
  email        : string,
  message      : string,
  name?        : string
  ip?          : string,
  sentiment?   : 'positive'|'neutral'|'negative',
  tags?        : string|string[],
  properties?  : { [key: string]: string },
  attachments? : number[],
  nps?         : number,
  language?    : string
};

@Component({
  selector: 'wm-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent  {

  readonly msgs$: Observable<any>;
  readonly form: FormGroup;

  get profile() { return this.content.user.data || {}; }
  
  constructor(private content: ContentResolver, private builder: FormBuilder, private dialog: MatDialog, private doorbell: DoorbellService) { 

    // Gets the localized content pre-fetched by the resolver during routing
    this.msgs$ = content.stream("navigator.feedback");

    this.form = this.builder.group({
      'name'   : [ '' ],
      'email'  : [ '', [ Validators.required, Validators.email ] ],
      'message': [ '', Validators.required ]
    });
  }

  @ViewChild('formTemplate', { static: true }) 
  private template : TemplateRef<FeedbackComponent>;
  
  public open() {

    this.form.setValue({
      name: this.profile.name || '',
      email: this.profile.email || '',
      message: ''
    });

    this.dialog.open(this.template, {  disableClose: true })
      .afterClosed().subscribe( () => this.form.reset() );
  }

  public submit() {

    this.doorbell.submit({ 
      
      language: this.content.language, 
      
      ...this.form.value 
    
    }).then( () => this.dialog.closeAll() );    
  }
}
