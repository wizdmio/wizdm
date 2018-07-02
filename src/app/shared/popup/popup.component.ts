import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface PopupData {
  title? : string,
  text?: string,
  ok? : string,
  cancel?: string
}

@Component({
  selector: 'wm-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  constructor(private ref: MatDialogRef<PopupComponent>, 
              @Inject(MAT_DIALOG_DATA) private data: PopupData ) { }


  ngOnInit() {
  }
}
