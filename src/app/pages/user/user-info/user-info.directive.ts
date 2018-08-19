import { Directive, Input, HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { UserInfoComponent, UserInfoData } from './user-info.component';
import { wmUser, wmProject } from 'app/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Directive({
  selector: '[wmUserInfo]'
})
export class UserInfoDirective {

  @Input('wmUserInfo') userId: string;

  @Input() user: wmUser;

  @Input('owner') project: wmProject;

  @HostListener('click') onclick() {
    this.show(this.userId);
  }

  constructor(private dialog: MatDialog) {}

  /**
   * Displays the dialog for file selection 
   * @param config MatDialog configuration
   * @returns an Observavble resolving to the selcted file or null if cancelled
   */
  public show(userId: string, config? /*: MatDialogConfig = { width: '50vw' }*/)/*: Observable<wmUser>*/ {

    let data: UserInfoData = {
      userId,
      project: this.project,
      user: this.user
    };

    return this.dialog.open(UserInfoComponent, { ...config, data });//.afterClosed();
  }
}
