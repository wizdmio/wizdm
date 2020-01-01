import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/** PopupData describes the popup dialog content
 * @param title title of the popup
 * @param message body message
 * @param ok caption of the 'ok' button. Enables the button when defined. Returns true when pressed
 * @param cancel caption of the 'cancel' button. Enables the button when defined. Returns false when pressed 
 */
export interface PopupData {
  title?  : string,
  message : string,
  cancel? : string,
  ok?     : string
}

@Component({
  selector: 'wm-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  host: { class: 'wm-popup' },
  encapsulation: ViewEncapsulation.None
})
/** PopupComponent implements the popup dialog standard appearance */
export class PopupComponent {

  constructor(readonly ref: MatDialogRef<PopupComponent>, @Inject(MAT_DIALOG_DATA) public data: PopupData) {}
}
