import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wm-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.scss']
})
export class UserPhotoComponent {

  @Input() photo: string;

  @Output() update = new EventEmitter<File>();

  @Output() delete = new EventEmitter<void>();

  public upload(files: FileList) {

    if(files.length <= 0) { return; }

    this.update.emit( files.item(0) );
  }
}
