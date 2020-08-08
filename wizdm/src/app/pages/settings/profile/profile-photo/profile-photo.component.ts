import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from '@wizdm/connect/storage';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent {

  public progress$: Observable<number>;

  constructor(private storage: StorageService) {}

  @Input() folder: string;

  @Input() url: string;

  @Output() update = new EventEmitter<string>();

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
    if(ref) { ref.delete().then( () => this.update.emit( null ) ); }
    else { this.update.emit( null ); }
  }
}
