import { UserProfile, UserData } from 'app/utils/user';
import { Component } from '@angular/core';

@Component({
  selector: 'wm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(private user: UserProfile) {} 

  /** The new user data */
  private data: UserData = {};

  /* The current user profile data */
  get profile(): UserData { return this.user.data; }
  set profile(data: Partial<UserData>) {

    // Combines the profile and preferences change into a new profile data object
    this.data = { ...this.data, ...data };
  }

  /** Updates the profile data */
  public updateProfile() {
    return this.user.update(this.data);
  }

  /** Updates the profile photo */
  public updatePhoto(photo: string) {
    return this.user.update({ photo });
  }
}
