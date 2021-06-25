import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@wizdm/connect/auth';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'wm-consent-dlg',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent {

  constructor(/*@Inject(MAT_DIALOG_DATA) readonly data: any,*/ dlg: MatDialogRef<string, boolean>, auth: AuthService) {

    // Closes the dialog as soon as the user authenticates
    auth.state$.pipe( filter(state => !!state), take(1) ).subscribe( () => dlg.close(false) );
  }
}
