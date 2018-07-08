import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ContentService, AuthService, LanguageOption } from 'app/core';
import { ListItemField, ListItemValidators } from 'app/shared/list-item/list-item.component';

@Component({
  selector: 'wm-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private msgs = null;
  private options: LanguageOption[]; 

  constructor(private content: ContentService,
              private auth   : AuthService) { }

  ngOnInit() {
    // Gets the localized content
    this.msgs = this.content.select('dashboard.profile');

    // WARNING: we buffers languageOptions into a local variable to prevent
    // the *ngFor on mat-select to run over an infinite loop due to an issue
    // it seems they still can't fix
    //return this.content.languageOptions;
    this.options = this.content.languageOptions;
  }

  private userProfileField(field: any): ListItemField {

    let value = this.auth.userProfile ? this.auth.userProfile[field.key] : '';
    let type = 'input';
    let options = null;

    if(field.key == 'lang') {

      type = 'select';

      // Shows the current and supported language label
      value = this.content.language;
      options = this.options;
    }

    // Returns a proper ListItemField object
    return {
      type,
      name: field.key,
      icon: field.icon,
      label: field.label,
      value,
      options
    } as ListItemField;
  }

  private userProfileValidators(key: string): ListItemValidators {

    return key == 'email' ?  {

      validators: [ Validators.required, Validators.email ],
      errors: this.msgs.errors
    
    } : {};
  }

  private updateUserProfile(key: string, value: any) {

    if(key === 'email') {

      // TODO: Initiate the email change procedure
    }
    else { 
      
      // Update the value otherwhise
      this.auth.updateUserProfile({ [key]: value });

      // Navigate to the new language
      if(key === 'lang') {

        // Switch to the selected language
        this.content.switch(value, ['dashboard']);
      }
    }
  }
}