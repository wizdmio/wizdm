import { UserProfile } from 'app/navigator/providers/user-profile';
import { Component } from '@angular/core';

@Component({
  selector: 'wm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(readonly user: UserProfile) {}  
}
