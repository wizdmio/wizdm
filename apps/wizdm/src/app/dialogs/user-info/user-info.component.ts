import { Component, OnInit, Input, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from '@wizdm/connect/database';
import { dbUser } from 'app/auth';

@Component({
  selector: 'wm-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  host: { 'class': 'wm-user-info' }
})
export class UserInfoComponent {

  @ViewChild('template', { static: true }) 
  private template: TemplateRef<UserInfoComponent>;

  constructor(private dialog: MatDialog, private database: DatabaseService) { }

  // Loads the member's profile from the database
  private loadUser(userId: string): Promise<dbUser> {
    return userId ? this.database.document<dbUser>(`/users/${userId}`)
      .get() : Promise.resolve(<dbUser>{});
  }

  public user: dbUser;

  // Accepts user info in various forms
  @Input('user') set setUser(user: dbUser) { // as a user object
    this.user = user;
  }

  @Input('userId') set userId(id: string) { // As a user id
    this.loadUser(id)
      .then( user => this.user = user );
  }

  public show(): Promise<void> {
    return this.dialog.open(this.template, { 
      panelClass: ['mat-dialog-reset', 'wm-theme-colors'],
      autoFocus: false
    }).afterClosed().toPromise();
  }
}
