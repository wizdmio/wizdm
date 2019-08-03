import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DoorbellService } from '@wizdm/doorbell';
import { ContentResolver } from '../../core/content';
import { Observable } from 'rxjs';

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
  styleUrls: ['./feedback.component.scss'],
  host: { 'class': 'wm-feedback' }
})
export class FeedbackComponent {

  readonly msgs$: Observable<any>;
  readonly form : FormGroup;
  public files: FileList;
  public success = false;
  public sending = false;
  public sent = false;

  get profile() { return this.content.user.data || {}; }
  get authenticated() { return this.content.user.authenticated; }

  get fileSizeExceeded(): boolean {

    if(!this.files || this.files.length === 0) { return false; }

    for(let i = 0; i < this.files.length; i++) {

      if(this.files[i].size > this.doorbell.maxFileSize) {
        return true;
      }
    }

    return false;
  }
  
  constructor(private content  : ContentResolver, 
              private builder  : FormBuilder, 
              private dialog   : MatDialog, 
              private doorbell : DoorbellService) { 

    // Gets the localized content pre-fetched by the resolver during routing
    this.msgs$ = content.stream("feedback");

    this.form = this.builder.group({
      'name'   : [ '' ],
      'email'  : [ '', [ Validators.required, Validators.email ] ],
      'message': [ '', Validators.required ]
    });
  }

  @ViewChild('formTemplate', { static: true }) 
  private template: TemplateRef<FeedbackComponent>;
  private refDialog: MatDialogRef<FeedbackComponent>;
  
  public open() {

    this.sending = this.sent = false;

    // Initializes the form with the authenticated user name/email when available
    this.form.setValue({
      name: this.profile.name || '',
      email: this.profile.email || '',
      message: ''
    });

    // Opens the form dialog
    this.refDialog = this.dialog.open(this.template, { 
      panelClass: 'wm-feedback',
      disableClose: true
    });

    // Rings the doorbell when opening the feedback form
    this.refDialog.afterOpened().subscribe( () => 
      // Call the Doorbell restful api and emit the result
      this.doorbell.ring().then( success => this.feedbackOpen.emit(success) ) 
    );

    // Resets the form on closed
    this.refDialog.afterClosed().subscribe( () => {
      
      // Resets the form fields
      this.form.reset();

      // Resets attachments
      this.files = null;
      
      // Re-enables the form
      this.form.enable();
    
    });
  }

  @Output('rang') feedbackOpen = new EventEmitter<boolean>();

  public send() {

    // Turns the sending flag on
    this.sending = true;

    // Disables the form whie sending
    this.form.disable();

    // Submit the feedback report to Doorbell.io
    this.doorbell.submit({ 

      // Spreads the feedback form data
      ...this.form.value,
      
      // Adds the current language
      language: this.content.language,

      // Includes the user id when available
      properties: this.authenticated ? { userId: this.profile.id } : undefined
    
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

  // Credits redirection helper
  public redirect(url: string): boolean {
    
    // Redirects to the external url closing the dialog
    this.content.navigateByUrl(url)
      .then( () => this.refDialog.close() );
    
    // Prevents default
    return false;
  }
}
