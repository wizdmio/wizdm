import { Component, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { UserProfile } from 'app/utils/user';
import { MatDialog } from '@angular/material/dialog';
import { DoorbellService } from '@wizdm/doorbell';
import { DialogComponent } from '@wizdm/elements/dialog';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { Subscription } from 'rxjs';

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
export class FeedbackComponent extends DialogComponent implements AfterViewInit, OnDestroy {

  private sub: Subscription;

  public name: string;
  public email: string;
  public message: string;
  public files: FileList;
  public success = false;
  public sending = false;
  public sent = false;

  constructor(dialog: MatDialog, private user: UserProfile, private doorbell: DoorbellService, private actionLink: ActionLinkObserver) { 
    super(dialog);

    this.panelClass = ['wm-feedback'];
  }

  get me() { return this.user.data || {}; }
  
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

  ngAfterViewInit() {

    // Registers the dialog to react on 'contact' actionLink. The registration takes place in AfterViewInit making sure
    // to intercept requests even when coming as an external redirection causing the app to load from scratch.
    this.sub = this.actionLink.register('contact').subscribe( () => this.open() );
  }

  // Disposes of the subscritpion
  ngOnDestroy() { this.sub.unsubscribe(); }
  
  public open() {

    this.sending = this.sent = false;

    // Initializes the form with the authenticated user name/email when available
    this.name = this.me.fullName || this.me.name || '';
    this.email = this.me.email || '';
    this.message = '';
    this.files = null;

    // Opens the form dialog
    const ref = super.open();

    // Rings the doorbell when opening the feedback form
    ref.afterOpened().subscribe( () => 
      // Call the Doorbell restful api and emit the result
      this.doorbell.ring().then( success => this.feedbackOpen.emit(success) ) 
    );

    return ref;
  }

  @Output('rang') feedbackOpen = new EventEmitter<boolean>();

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
