import { UserRecord, UserUpdate, UserIdentifier } from '../admin-types';
import { FunctionsClient } from '@wizdm/connect/functions/client';
import { AuthService } from '@wizdm/connect/auth';
import { map, switchMap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})
export class UserAccessComponent {

  public email: string;
  public result: any;

  constructor(readonly auth: AuthService, private client: FunctionsClient) { }

  /** List users based on idntifiers (uid, email, phone... */
  private listUsers(identifiers: UserIdentifier[]): Observable<UserRecord[]> {

    return this.client.post<UserIdentifier[], UserRecord[]>('users', identifiers);
  }

  /** Updates a user record */
  private updateUser(uid: string, data: UserUpdate): Observable<UserRecord> {

    return this.client.patch<UserUpdate, UserRecord>(`users/${uid}`, data);
  }

  private getUserByEmail(email: string): Observable<UserRecord> {

    return this.listUsers([{ email }]).pipe( map( users => users[0] ));
  }

  public viewAccess(email: string) {

    return this.getUserByEmail(email).subscribe( user => 
      this.result = user && user.customClaims 
    );
  }

  public grantAccess(email: string) {

    return this.getUserByEmail(email).pipe(
      switchMap( user => this.updateUser(user.uid, { 
        customClaims: { 
          admin: true 
        }
      }))
    ).subscribe( user => this.result = user );
  }

  public revokeAccess(email: string) {

    return this.getUserByEmail(email).pipe(
      switchMap( user => this.updateUser(user.uid, { 
        customClaims: null 
      }))
    ).subscribe( user => this.result = user );
  }
}
