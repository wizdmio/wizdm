import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DoorbellService } from '@wizdm/doorbell';
import { ContentResolver } from '../../core';
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
  public   files: FileList;
  public   sending = false;

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

    // Initializes the form with the authenticated user name/email when available
    this.form.setValue({
      name: this.profile.name || '',
      email: this.profile.email || '',
      message: ''
    });

    // Opens the form dialog
    const ref = this.dialog.open(this.template, {  disableClose: true });

    // Rings the doorbell when opening the feedback form
    ref.afterOpened().subscribe( () => 
      // Call the Doorbell resful api and emit the result
      this.doorbell.ring().then( success => this.rang.emit(success) ) 
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
  }

  @Output() rang = new EventEmitter<boolean>();

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

      // Closes the dialog
      this.dialog.closeAll();
      
      // Emits the sent result
      this.sent.emit(success);
    });  
  }

  @Output() sent = new EventEmitter<boolean>();

  // Credits redirection helper
  public redirect(url: string): boolean {
    // Closes the dialogs
    this.dialog.closeAll();
    // Navigates to the destination redirecting when necessary
    this.content.navigateByUrl(url);
    // Prevents default
    return false;
  }
}
