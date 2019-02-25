import { Component, OnInit, Input, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ContentManager } from '@wizdm/content';
import { DatabaseService, wmUser } from '@wizdm/connect';
import { wmColor, wmColorMap, COLOR_MAP } from '../../elements/colors/colors';
import { wmProject } from '../../core';

@Component({
  selector: 'wm-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  @ViewChild('template') template: TemplateRef<UserInfoComponent>;

  private config: MatDialogConfig = { 
    panelClass:  'mat-dialog-reset',
    autoFocus: false
    //disableClose: true,
    //data: this
  };

  public msgs;  

  constructor(@Inject(COLOR_MAP) 
              private colorMap: wmColorMap, 
              private dialog: MatDialog,
              private content: ContentManager,
              private database: DatabaseService) {

    // Gets the localized content
    this.msgs = this.content.select('profile.info');
  }

  // Loads the user profile from the database
  private loadUser(userId: string): Promise<wmUser> {
    return userId ? this.database.document<wmUser>('/users',userId)
      .get().toPromise()
        : Promise.resolve(<wmUser>{});
  }

  ngOnInit() {}

  public user: wmUser;

  // Accepts user info in various forms
  @Input('userId') set userId(id: string) { // As a user id
    this.loadUser(id)
      .then( user => this.user = user );
  }   
  
  @Input('user') set setUser(user: wmUser) { // as a user object
    this.user = user;
  }

  @Input('author') set setOwner(project: wmProject) { // as a project's author
    this.loadUser(project.author)
      .then( user => this.user = user );
  }

  // Enable
  //@Input() tools: boolean = false;

  public show(): Promise<void> {
    return this.dialog.open(this.template, this.config)
      .afterClosed()
      .toPromise();
  }

  public get themeColor(): wmColor {
    return this.colorMap[this.user.color || 'none'];
  }

  // Computes the color of the avatar based on the background
  public get avatarColor(): string {
    let color = this.user.color || 'none';
    return this.colorMap[ color !== 'none' ? color : 'grey'].value;
  }

  public setColor(color: wmColor) {
    this.user.color = color.color;
  }
}
