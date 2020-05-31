import { Component } from '@angular/core';
import { AuthService, User } from '@wizdm/connect/auth';
import { default as moment } from 'moment';

@Component({
  selector: 'wm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  private providerId: string;

  constructor(readonly auth: AuthService) { 

    // Gets the authentication provider
    auth.getProviderId().then( provider => this.providerId = provider );
  }

  get user(): User { return this.auth.user || {} as User; }

  get created(): string { return moment(this.user.metadata?.creationTime).format('ll'); }

  get providers(): string[] { return (this.user.providerData || []).map( data => data.providerId ); }

  get usePassword(): boolean { return this.providerId === 'password'; }

  get emailVerified(): boolean { return this.user.emailVerified || false; }
}
