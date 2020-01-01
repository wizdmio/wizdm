import { Component, OnInit, Input, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatabaseService } from '@wizdm/connect/database';
import { wmMember } from 'app/core/member';
//import { wmProject } from 'app/core/project';

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
  private loadUser(userId: string): Promise<wmMember> {
    return userId ? this.database.document<wmMember>(`/users/${userId}`)
      .get() : Promise.resolve(<wmMember>{});
  }

  public user: wmMember;

  // Accepts user info in various forms
  @Input('user') set setUser(user: wmMember) { // as a user object
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
