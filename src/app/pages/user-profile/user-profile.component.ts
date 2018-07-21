import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatExpansionPanel } from '@angular/material';
import { ContentService, AuthService, LanguageOption, CanPageDeactivate } from 'app/core';
import { PopupService } from 'app/shared';
import { UserProfileItemComponent, UserItemValidators } from './user-profile-item/user-profile-item.component';

import * as moment from 'moment';

@Component({
  selector: 'wm-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, CanPageDeactivate  {

  @ViewChildren(UserProfileItemComponent) profileItems: QueryList<UserProfileItemComponent>;
  @ViewChildren(MatExpansionPanel) profilePanels: QueryList<MatExpansionPanel>;

  private msgs = null;
  private langOptions: LanguageOption[]; 

  constructor(private content : ContentService,
              private auth    : AuthService,
              private popup   : PopupService,
              private router  : Router,
              private route   : ActivatedRoute) { }

  ngOnInit() {
    // Gets the localized content
    this.msgs = this.content.select('profile');

    // WARNING: we buffers languageOptions into a local variable to prevent
    // the *ngFor on mat-select to run over an infinite loop due to an issue
    // it seems they still can't fix
    this.langOptions = this.content.languageOptions;
  }

  private profileEditable(key: string) {
    
    // Hardcoded editable flag to prevent unwanted db modifications
    return key === 'profile:name' ||
           key === 'profile:email' ||
           key === 'profile:phone' ||
           key === 'profile:birth' ||
           key === 'profile:gender' ||
           key === 'profile:motto' ||
           key === 'profile:lang';
  }

  private profileValue(key: string): string {

    let keys = key.split(':');

    // Intercepts timestapms requests
    if(key === 'profile:created') {
      let stamp = this.auth.userProfile[ keys[1] ];
      return stamp ? moment(stamp.toDate()).toString() : '';
    }

    // Select the source of values based on the first half of the key
    let source = keys[0] === 'profile' ? this.auth.userProfile :
                 keys[0] === 'user' ? this.auth.userAuth :
                 {};
 
    // Returns tne value based on the second half of the key
    return source[ keys[1] ];
  }

  private profileOptions(key: string) {

    switch(key) {

      case 'profile:gender':
      return this.msgs.genders;

      case 'profile:lang':
      return this.langOptions;

      case 'user:emailVerified':
      return this.msgs.identity;
    }

    return null;
  }

  private profileValidators(key: string): UserItemValidators {

    return key == 'profile:email' ?  {

      validators: [ Validators.required, Validators.email ],
      errors: this.msgs.errors
    
    } : null;
  }

  private updateUserProfile(key: string, value: any) {
  
    let keys = key.split(':');  

    if(keys[0] === 'profile') {

      // Update the value otherwhise
      this.auth.updateUserProfile({ [ keys[1] ]: value });

      // Navigate to the new language
      if(key === 'profile:lang') {

        // Switch to the selected language
        this.content.switch(value);
      }
    }
  }

  // Checks if some of the profile items is i edit mode
  private get itemChanges() {
    return this.profileItems && this.profileItems.some( item => item.edit );
  }

  private applyAllItemChanges(): boolean {

    let success = true;

    // Update each profile item in edit mode
    this.profileItems.forEach( item => {
      if(item.edit) {
        success = item.updateControl() && success;
      }
    });

    return success;
  }

  private panelClose(index: number) {

    // Applies all the changes...
    if(!this.applyAllItemChanges()) {

      // If there's something wrong, seek for the closing panel
      let panel = this.profilePanels.find( (p , i) => {
          return i === index;
        });

      // Makes sure to keep it opened, so, fo the user to see the error message
      panel.open();
    }
  }

  private action(code: string) {

    // Prepare the right popup according to the action code
    let popup = this.msgs.popups[code];

    // Ask for confirmation prior to initiate the requested action
    ( popup ? this.popup.popupDialog(popup) : Promise.resolve<boolean>(true) )
      .then( proceed => {

        // If we can proceed, navigates to the login page applying the requested action code
        if(proceed) {
          this.router.navigate(['..','login'], {
            relativeTo: this.route, 
            queryParams: { 
              mode: code 
            } 
          });
        }
    });
  }

  private disabled(code: string): boolean {

    // Disable the emailVerify action in case the account email has been verified already
    if(code === 'emailVerify') {

      let user = this.auth.userAuth;
      return user ? user.emailVerified : false;
    }

    return false;
  }

  public canDeactivate() {

    let popup = this.msgs.popups.canLeave;

    // Ask the user to proceed in case there are unsaved changes
    if(popup && this.itemChanges) { 
      return this.popup.popupDialog(popup);
    }

    // Enable leaving otherwise
    return true;
  }
}