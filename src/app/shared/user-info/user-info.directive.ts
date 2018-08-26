import { Directive, Input, HostListener, HostBinding } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UserInfoComponent, UserInfoData } from './user-info.component';
import { wmUser, wmProject } from 'app/core';

@Directive({
  selector: '[wmUserInfo]'
})
export class UserInfoDirective {

  // Accepts user info in various forms
  @Input('wmUserInfo') userId: string;// As a user id
  @Input() user: wmUser;              // as a user object
  @Input() owner: wmProject;          // as a project's owner

  // Applies the 'cursor: pointer' style to the host component
  @HostBinding('style.cursor') cursor = 'pointer';

  // Shows the user info popup dialog on click
  @HostListener('click') onclick() {
    this.show(this.userId);
  }

  constructor(private dialog: MatDialog) {}

  /**
   * Displays the dialog for file selection 
   * @param config MatDialog configuration
   * @returns an Observavble resolving to the selcted file or null if cancelled
   */
  public show(userId: string, config? /*: MatDialogConfig = { width: '50vw' }*/) {

    let data: UserInfoData = {
      userId,
      project: this.owner,
      user   : this.user
    };

    return this.dialog.open(UserInfoComponent, { ...config, data });
  }
}
