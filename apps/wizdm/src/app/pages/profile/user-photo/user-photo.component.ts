import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from '@wizdm/connect/storage';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.scss']
})
export class UserPhotoComponent {

  public progress$: Observable<number>;

  constructor(private storage: StorageService) {}

  @Input() folder: string;

  @Input() url: string;

  @Output() update = new EventEmitter<string>();

  @Output() delete = new EventEmitter<void>();

  public uploadFile(files: FileList) {

    if(files.length <= 0) { return; }

    const file = files.item(0);

    // Creates the uploading task
    const task = this.storage.upload(`${this.folder}/${file.name}`, file);

    // Creates a progress observable from the task
    this.progress$ = task.pipe( map( snap => Math.floor(100 * snap.bytesTransferred / snap.totalBytes)) );

    // Gets thh uploaded url once completed
    task.then( snap => snap.ref.getDownloadURL() )
      // Notifies abouot the new url
      .then( url => this.update.emit( url ) )
      // Deletes the progress observable removing the progress bar from the view
      .then( () => delete this.progress$ )
  }

  public deleteFile() {

    if(!this.url) { return; }
    // Gets the torage ref from the URL
    const ref = this.storage.fromURL(this.url);
    // Deletes the file and notifies about it
    ref.delete().then( () => this.delete.emit() );
  }
}
