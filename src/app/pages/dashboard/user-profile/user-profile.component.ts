import { Component, OnInit } from '@angular/core';
import { ContentManager, AuthService } from 'app/core';

@Component({
  selector: 'wm-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private msgs = null;

  constructor(private content: ContentManager,
              private auth: AuthService) { }

  ngOnInit() {
    // Gets the localized content
    this.msgs = this.content.select('dashboard.profile');
  }

  userData(key: string): string {
    return this.auth.userData ? this.auth.userData[key] : '';
  }
}
