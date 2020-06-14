import { Component } from '@angular/core';
import { UserProfile } from 'app/core/user-profile';

@Component({
  selector: 'wm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(readonly user: UserProfile) {}  
}
