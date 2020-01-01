import { Injectable  } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent, PopupData } from './popup.component';
export { PopupData } from './popup.component';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
/**  
 * PopupService - used to shows a popup dialog typically to ask for user intervention 
 */
export class PopupService {

  constructor(private dialog: MatDialog) {}

  /** 
   * Replicates the general purpose functionality of MatDialog open
   * @param dialog ComponentRef or TemplateRef representing the dialog to be shown
   * @param config MatDialog config object
   * @return MatDialogRef to be used for further steps
   */
  public open(dialog, config?: MatDialogConfig): MatDialogRef<any> { 
    return this.dialog.open(dialog, config);
  }

  /** 
   * Provides a simplified way to show a popup dialog asking for confirming or cancelling 
   * @param data PopupData describing the popup content. The function resolves to of(true) in case data is null or undefined
   * @param maxWidth (optional) maximum popup width in px
   * @returns an Observable that completes when user select the ok (returning true) or cancel (returning false) option
   * @example this.dialog.popupDialog({
   *                  title: 'Save changes',
   *                  message: 'Are you sure leaving without saving changes?',
   *                  cancel: 'Cancel',
   *                  ok: 'Proceed'
   *                } as PopupData ).subscribe( proceed => {
   *                   if(proceed) {
   *                   // Do somenthing
   *                   }
   *                });
  */
  public popupDialog(data: PopupData, maxWidth?: number): Observable<boolean> {
    return data ? this.open(PopupComponent, { data, maxWidth } )
      .afterClosed() : of(true);
  }

  /** 
   * Pops-up a confirmation dialog resolving only when confirmed, suitable when you need to do nothing on cancel
   * @param data PopupData describing the popup content.
   * @example dialog.confirmPopup({
   *                  title: 'Save changes',
   *                  message: 'Are you sure leaving without saving changes?',
   *                  cancel: 'Cancel',
   *                  ok: 'Proceed'
   *                } as PopupData ).subscribe( () => this.leave() );
   */
  public confirmPopup(data: PopupData): Observable<boolean> {
    return this.popupDialog( data, 500 ).pipe( filter( result => result ) );
  }
}
