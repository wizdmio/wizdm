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
    return key === 'name' ||
           key === 'email' ||
           key === 'phone' ||
           key === 'birth' ||
           key === 'gender' ||
           key === 'motto' ||
           key === 'lang';
  }

  private profileValue(key: string): string {

    // Turns the timestamp into moment when needed
    if(key === 'created' || key === 'updated') {
      let stamp = this.auth.userProfile[key];
      return stamp ? moment(stamp.toDate()).toString() : '';
    }

    // Intercepts the requests of user account data
    if(key === 'provider' || key === 'accountEmail') {

      let user = this.auth.authState;
      return user ? key === 'provider' ? user.providerId : user.email : '';
    }

    // Returns the profile value otherwise
    return this.auth.userProfile ? this.auth.userProfile[key] : '';    
  }

  private profileOptions(key: string) {

    const options = { gender: this.msgs.genders, lang: this.langOptions };
    return options[key];
  }

  private profileValidators(key: string): UserItemValidators {

    return key == 'email' ?  {

      validators: [ Validators.required, Validators.email ],
      errors: this.msgs.errors
    
    } : null;
  }

  private updateUserProfile(key: string, value: any) {
  
    // Update the value otherwhise
    this.auth.updateUserProfile({ [key]: value });

    // Navigate to the new language
    if(key === 'lang') {

      // Switch to the selected language
      this.content.switch(value);
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

    switch(code) {

      case 'changeEmail':
      this.changeUserEmail();
      break;
      
      case 'changePassword':
      this.changeUserPassword();
      break;
      
      case 'deleteAccount':
      this.deleteUserAccount();
      break;
    }
  }

  public canDeactivate() {

    // Ask the user to proceed in case there are unsaved changes
    if(this.itemChanges) { 
      return this.popup.popupDialog(this.msgs.canLeave);
    }

    // Enable leaving otherwise
    return true;
  }


  private changeUserEmail() {
    
    // Ask for confirmation prior to initiate the email change procedure
    this.popup.popupDialog(this.msgs.canChange)
      .then( proceed => {

        if(proceed) {
          this.router.navigate(['..','login'], {
            relativeTo: this.route, 
            queryParams: { 
              mode: 'change-email' 
            } 
          });
        }
    });
  }

  private changeUserPassword() {
    
    // Ask for confirmation prior to initiate the reset password procedure
    this.popup.popupDialog(this.msgs.canReset)
      .then( proceed => {

        if(proceed) {
          this.router.navigate(['..','login'], {
            relativeTo: this.route, 
            queryParams: { 
              mode: 'change-password' 
            } 
          });
        }  
    });
  }

  private deleteUserAccount() {
    
    // Ask for confirmation prior to delete the user account and data
    this.popup.popupDialog(this.msgs.canDelete)
      .then( proceed => {

        if(proceed) {
          this.router.navigate(['..','login'], {
            relativeTo: this.route, 
            queryParams: { 
              mode: 'delete' 
            } 
          });  
        }
    });
  }
}