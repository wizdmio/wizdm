import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContentService } from 'app/core';

@Component({
  selector: 'wm-terms-privacy-popup',
  template: '<div mat-dialog-content>\
              <wm-terms-privacy fullScreen="true" disableActions="true"></wm-terms-privacy>\
            </div>\
            <div mat-dialog-actions>\
              <button mat-button [mat-dialog-close]="true">\
                {{buttons?.ok}}\
              </button>\
            </div>',
  styles: []
})
export class TermsPrivacyPopupComponent implements OnInit {

  // Wrappers to turn the Terms-Privicy page into a PopupDialog forcing it full screen for better readeability
  //
  constructor(private ref: MatDialogRef<TermsPrivacyPopupComponent>, 
              @Inject(MAT_DIALOG_DATA) private data: any,
              private content: ContentService ) { }

  public buttons: any = null;

  ngOnInit() {

    // Gets localized button labels
    this.buttons = this.content.select('shortTerms.buttons');
  }
}
