import { UserProfile, UserData } from 'app/utils/user-profile';
import { UserFormComponent } from './user-form/user-form.component';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'wm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  @ViewChild(UserFormComponent) form: UserFormComponent;

  constructor(private user: UserProfile) {} 

  /* The current user profile data */
  get profile(): UserData { return this.user.data; }

  /** Updates the profile data */
  public updateProfile(data: UserData) {

    return this.user.update(data)
      .then( () => this.form.markAsPristine() );
  }

  /** Updates the profile photo */
  public updatePhoto(photo: string) {
    return this.user.update({ photo });
  }
}
