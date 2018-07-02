import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PopupComponent, PopupData } from './popup.component';
export { PopupData } from './popup.component';
//import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) {}

  public popupDialog(data: PopupData): Promise<boolean> {

    return this.dialog.open(PopupComponent, { data } )
      .afterClosed()  
      .toPromise();
  }
}
