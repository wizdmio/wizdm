import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'wm-consent-dlg',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent {

  //constructor(@Inject(MAT_DIALOG_DATA) readonly data: any, private dlg: MatDialogRef<string>) { }
}
