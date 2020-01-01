import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wm-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent {

  @Input() photo: string;

  @Output() update = new EventEmitter<File>();

  @Output() delete = new EventEmitter<void>();

  public upload(files: FileList) {

    if(files.length <= 0) { return; }

    this.update.emit( files.item(0) );
  }
}
