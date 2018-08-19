import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { UploadsComponent } from './uploads.component';
import { wmUserFile } from 'app/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/**
 * Simple service showing a dialog to choose among the user's files
 */
export class UploadsService {

  constructor(private dialog: MatDialog) {}

  /**
   * Displays the dialog for file selection 
   * @param config MatDialog configuration
   * @returns an Observavble resolving to the selcted file or null if cancelled
   */
  public show(config: MatDialogConfig = { width: '80vw' }): Observable<wmUserFile | null> {
    return this.dialog.open(UploadsComponent, config).afterClosed();
  }

  /**
   * Displays the dialog d=for file selection
   * @param config MatDialog configuration
   * @returns an Observavble resolving to the selcted file only
   */
  public chooseFile(config?: MatDialogConfig): Observable<wmUserFile> {
    return this.show(config).pipe( filter( file => file !== null) );
  }
}
