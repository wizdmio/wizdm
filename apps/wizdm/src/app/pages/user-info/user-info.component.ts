import { Component, OnInit, Input, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatabaseService, wmUser } from '@wizdm/connect';
import { wmProject } from '../../core/project';

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

  // Loads the user profile from the database
  private loadUser(userId: string): Promise<wmUser> {
    return userId ? this.database.document<wmUser>('/users',userId)
      .get().toPromise() : Promise.resolve(<wmUser>{});
  }

  public user: wmUser;

  // Accepts user info in various forms
  @Input('user') set setUser(user: wmUser) { // as a user object
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
