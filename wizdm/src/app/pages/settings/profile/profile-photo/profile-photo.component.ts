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

  /** True whenever the current URL refers to a valid storage file */
  public validUrl: boolean;

  constructor(private storage: StorageService) {}

  /** Sets the image folder */
  @Input() folder: string;

  /** Sets the image url */
  @Input() set url(url: string) {

    // Vefifies the validity of the url enabling the deletion.
    this.validUrl = this.storage.testURL(this._url = url);
  }

  /** Returns the current url  */
  get url(): string { return this._url; }
  private _url: string;


  /** Emits image updates */
  @Output() update = new EventEmitter<string>();

  /** Uploads a new image */
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

  /** Deletes the current image */
  public deleteFile() {

    if(!this.url) { return; }

    // Gets the torage ref from the URL
    const ref = this.storage.fromURL(this.url);
    
    // Deletes the file and notifies about it
    if(ref) { ref.delete().then( () => this.update.emit( null ) ); }
    else { this.update.emit( null ); }
  }
}
