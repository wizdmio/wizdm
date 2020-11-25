import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wm-post-dlg',
  templateUrl: './post-dlg.component.html',
  styleUrls: ['./post-dlg.component.scss']
})
export class PostDialogComponent implements OnInit {
  public items: string;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private ref: MatDialogRef<any>) { }

  ngOnInit(): void { }
}
