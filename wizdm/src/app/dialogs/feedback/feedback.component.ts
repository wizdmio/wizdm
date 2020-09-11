import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DoorbellService } from '@wizdm/doorbell';
import { UserProfile } from 'app/utils/user';

@Component({
  selector: 'wm-feedback-dlg',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {

  public name: string;
  public email: string;
  public message: string;
  public files: FileList;
  public success = false;
  public sending = false;
  public sent = false;

  get me() { return this.user.data || {}; }
  
  get authenticated() { return this.user.auth.authenticated; }

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private ref: MatDialogRef<any>, private user: UserProfile, private doorbell: DoorbellService) { 

    // Initializes the form with the authenticated user name/email when available
    this.name = this.me.fullName || this.me.name || '';
    this.email = this.me.email || '';
    this.message = '';
    this.files = null;

    // Prevents user to close the dialog
    //this.ref.disableClose = true;

    // Rings the doorbell when opening the feedback form
    this.ref.afterOpened().subscribe( () => this.doorbell.ring() );
  }

  get fileSizeExceeded(): boolean {

    if(!this.files || this.files.length === 0) { return false; }

    for(let i = 0; i < this.files.length; i++) {

      if(this.files[i].size > this.doorbell.maxFileSize) {
        return true;
      }
    }

    return false;
  }

  public send(language?: string) {

    // Turns the sending flag on
    this.sending = true;

    // Submit the feedback report to Doorbell.io
    this.doorbell.submit({ 

      // Main form data
      name: this.name,
      email: this.email,
      message: this.message,
      
      // Adds the current language
      language,

      // Includes the user id when available
      properties: this.authenticated ? { userId: this.me.id } : undefined
    
    }, this.files).then( success => {

      // Tracks the result
      this.success = success;

      // Turns the sending flag off
      this.sending = false;

      // Flags as sent showing the resulting message
      this.sent = true;
    }); 
  }
}
