import { Component } from '@angular/core';
import { AuthService } from '@wizdm/connect/auth';
import { AdminService, UserRecord } from '@wizdm/admin';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})
export class UserAccessComponent {

  public email: string;
  public result: any;

  constructor(readonly auth: AuthService, private admin: AdminService) { }

  private getUserByEmail(email: string): Observable<UserRecord> {

    return this.admin.listUsers([{ email }]).pipe( map( users => users[0] ));
  }

  public viewAccess(email: string) {

    return this.getUserByEmail(email).subscribe( user => 
      this.result = user && user.customClaims 
    );
  }

  public grantAccess(email: string) {

    return this.getUserByEmail(email).pipe(
      switchMap( user => this.admin.updateUser(user.uid, { 
        customClaims: { 
          admin: true 
        }
      }))
    ).subscribe( user => this.result = user );
  }

  public revokeAccess(email: string) {

    return this.getUserByEmail(email).pipe(
      switchMap( user => this.admin.updateUser(user.uid, { 
        customClaims: null 
      }))
    ).subscribe( user => this.result = user );
  }
}
