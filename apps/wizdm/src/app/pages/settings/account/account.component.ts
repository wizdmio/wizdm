import { Component } from '@angular/core';
import { AuthService, User } from '@wizdm/connect/auth';

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

  /** The user object */
  get user(): User { return this.auth.user || {} as User; }

  /** The array of providers */
  get providers(): string[] { return (this.user.providerData || []).map( data => data.providerId ); }

  /** True whenever the provider we logged-in with requires a password */
  get usePassword(): boolean { return this.providerId === 'password'; }
}
