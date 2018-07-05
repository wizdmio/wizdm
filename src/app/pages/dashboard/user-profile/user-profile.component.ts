import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { ContentManager, AuthService, UserData } from 'app/core';
import { ListItemField, ListItemValidators } from 'app/shared/list-item/list-item.component';

@Component({
  selector: 'wm-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private msgs = null;

  constructor(private content: ContentManager,
              private router : Router, 
              private route  : ActivatedRoute,
              private auth   : AuthService) { }

  ngOnInit() {
    // Gets the localized content
    this.msgs = this.content.select('dashboard.profile');
  }

  private userProfileField(field: any): ListItemField {

    let value = this.auth.userProfile ? this.auth.userProfile[field.key] : '';
    let type = field.key == 'email' ? 'email' : 'input';
    let options = null;

    if(field.key == 'lang') {

      type = 'select';

      // Maps the languages array into the list item select options
      // and turns the language code into the language description 
      // at the same time
      options = this.content.languages.map( lang => {
        if(lang.lang == value) {
          value = lang.label;//{ label: lang.label, value: lang.lang };
        }
        return lang.label;//{ label: lang.label, value: lang.lang };
      });
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

    if(key === 'lang') {
      value = this.content.languages.find( lang => {
        return lang.label === value;
      }).lang;
    }

    if(key === 'email') {

      // TODO: Initiate the email change procedure
    }
    else { 
      
      // Update the value otherwhise
      this.auth.updateUserProfile({ [key]: value });

      // Navigate to the new language
      if(key === 'lang') {
        this.router.navigate(['/', value, 'dashboard']);
      }
    }
  }
}