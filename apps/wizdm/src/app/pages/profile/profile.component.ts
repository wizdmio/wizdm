import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material';
import { UserProfile, wmFile } from '@wizdm/connect';
import { PopupService } from '@wizdm/elements';
import { ContentResolver, CanPageDeactivate } from '../../core';
import { NavigatorService } from '../../navigator';
import { UserItemComponent, UserItemValidators } from './item/item.component';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'wm-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class UserComponent implements OnInit, OnDestroy, CanPageDeactivate  {

  @ViewChildren(UserItemComponent) profileItems: QueryList<UserItemComponent>;
  @ViewChildren(MatExpansionPanel) profilePanels: QueryList<MatExpansionPanel>;

  private msgs$: Observable<any>;
  private sub: Subscription;
  public msgs: any = {};

  constructor(readonly content : ContentResolver,
              readonly nav     : NavigatorService,          
              private  profile : UserProfile,
              private  popup   : PopupService) { 

    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = content.stream('profile');
  }

  ngOnInit() {

    // Gets a snapshot of the localized content for internal use
    this.sub = this.msgs$.subscribe( msgs => {
    
      // Keeps a snapshot of the localized content for internal use
      this.msgs = msgs;

      // Activates the relevant toolbar actions
      this.nav.toolbar.activateActions(this.msgs.actions);
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  public get userImage(): string {
    return this.profile.data.img;
  }

  public selectImage(file: wmFile): void {
    // Updates the user image
    this.profile.update({ img: file.url || null });  
  }

  public profileEditable(key: string) {
    
    // Hardcoded editable flag to prevent unwanted db modifications
    return key === 'profile:name' ||
           key === 'profile:email' ||
           key === 'profile:phone' ||
           key === 'profile:birth' ||
           key === 'profile:gender' ||
           key === 'profile:motto' ||
           key === 'profile:lang';
  }

  public profileValue(key: string): string {

    let keys = key.split(':');

    // Intercepts timestapms requests
    if(key === 'profile:created') {
      let stamp = this.profile.data[ keys[1] ];
      return stamp ? moment(stamp.toMillis(), 'x').format(moment.defaultFormat) : '';
    }

    // Select the source of values based on the first half of the key
    let source = keys[0] === 'profile' ? this.profile.data :
                 keys[0] === 'user' ? this.profile.user :
                 {};
 
    // Returns tne value based on the second half of the key
    return source[ keys[1] ];
  }

  public profileOptions(key: string) {

    switch(key) {

      case 'profile:gender':
      return this.msgs.genders;

      case 'profile:lang':
      return this.msgs.languages;

      case 'user:emailVerified':
      return this.msgs.identity;
    }

    return null;
  }

  public profileValidators(key: string): UserItemValidators {

    return key == 'profile:email' ?  {

      validators: [ Validators.required, Validators.email ],
      errors: this.msgs.errors
    
    } : null;
  }

  public updateUserProfile(key: string, value: any) {
  
    let keys = key.split(':');  

    if(keys[0] === 'profile') {

      // Update the value otherwhise
      this.profile.update({ [ keys[1] ]: value });

      // Navigate to the new language
      if(key === 'profile:lang') {

        // Switch to the selected language
        this.content.switchLanguage(value);
      }
    }
  }

  // Checks if some of the profile items is in edit mode
  public get itemChanges() {
    return this.profileItems && this.profileItems.some( item => item.edit );
  }

  public applyAllItemChanges(): boolean {

    let success = true;

    // Update each profile item in edit mode
    this.profileItems.forEach( item => {
      if(item.edit) {
        success = item.updateControl() && success;
      }
    });

    return success;
  }

  public panelClose(index: number) {

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

  public action(code: string) {

    // Prepare the right popup according to the action code
    const popup = this.msgs.popups[code];

    // Ask for confirmation prior to initiate the requested action
    // Note: the function resolves to of(true) in case popup is null
    this.popup.confirmPopup(popup).subscribe( () => {

      // If we can proceed, navigates to the login page applying the requested action code
      this.content.goTo('login', { queryParams: { 
        mode: code 
      }});
    });
  }

  public disabled(code: string): boolean {

    // Disable the emailVerify action in case the account email has been verified already
    return (code === 'emailVerify') 
      ? this.profile.emailVerified
        : false;
  }

  public canDeactivate() {

    const popup = this.msgs.popups.canLeave;

    // Ask the user to proceed in case there are unsaved changes
    if(popup && this.itemChanges) { 
      return this.popup.popupDialog(popup);
    }

    // Enable leaving otherwise
    return true;
  }
}