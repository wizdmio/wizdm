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

  private userLanguage(): string {
    
    if(this.auth.userProfile == null) {
      return '';
    }

    let code = this.auth.userProfile.lang || 'en';
    return this.content.languages.find( lang => {
      return lang.lang == code;
    }).label;
  }

  private userProfile(key: string): string {

    if(key === 'lang') {
      return this.userLanguage();
    }

    return this.auth.userProfile ? this.auth.userProfile[key] : '';
  }
}
