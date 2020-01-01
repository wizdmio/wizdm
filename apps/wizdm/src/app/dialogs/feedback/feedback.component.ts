import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DoorbellService } from '@wizdm/doorbell';
import { DialogComponent } from '@wizdm/elements/dialog';
import { Member } from 'app/core/member';

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
  selector: 'wm-feedback-dlg',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  host: { 'class': 'wm-feedback' }
})
export class FeedbackComponent extends DialogComponent {

  readonly form : FormGroup;
  
  public files: FileList;
  public success = false;
  public sending = false;
  public sent = false;
  
  constructor(dialog: MatDialog, private builder: FormBuilder, private user: Member, private doorbell: DoorbellService) { 
    super(dialog);

    this.panelClass = 'wm-feedback';
    
    this.form = this.builder.group({
      'name'   : [ '' ],
      'email'  : [ '', [ Validators.required, Validators.email ] ],
      'message': [ '', Validators.required ]
    });
  }

  get member() { return this.user.data || {}; }
  
  get authenticated() { return this.user.auth.authenticated; }

  get fileSizeExceeded(): boolean {

    if(!this.files || this.files.length === 0) { return false; }

    for(let i = 0; i < this.files.length; i++) {

      if(this.files[i].size > this.doorbell.maxFileSize) {
        return true;
      }
    }

    return false;
  }
  
  public open() {

    this.sending = this.sent = false;

    // Initializes the form with the authenticated user name/email when available
    this.form.setValue({
      name: this.member.name || '',
      email: this.member.email || '',
      message: ''
    });

    // Opens the form dialog
    const ref = super.open();

    // Rings the doorbell when opening the feedback form
    ref.afterOpened().subscribe( () => 
      // Call the Doorbell restful api and emit the result
      this.doorbell.ring().then( success => this.feedbackOpen.emit(success) ) 
    );

    // Resets the form on closed
    ref.afterClosed().subscribe( () => {
      
      // Resets the form fields
      this.form.reset();

      // Resets attachments
      this.files = null;
      
      // Re-enables the form
      this.form.enable();
    });

    return ref;
  }

  @Output('rang') feedbackOpen = new EventEmitter<boolean>();

  public send(language?: string) {

    // Turns the sending flag on
    this.sending = true;

    // Disables the form whie sending
    this.form.disable();

    // Submit the feedback report to Doorbell.io
    this.doorbell.submit({ 

      // Spreads the feedback form data
      ...this.form.value,
      
      // Adds the current language
      language,

      // Includes the user id when available
      properties: this.authenticated ? { userId: this.member.id } : undefined
    
    }, this.files).then( success => {

      // Turns the sending flag off
      this.sending = false;

      // Flags as sent showing the resulting message
      this.sent = true;

      // Emits the result of submission while keeping track of it locally
      this.feedbackSent.emit(this.success = success);
    }); 
  }

  @Output('sent') feedbackSent = new EventEmitter<boolean>();
}
