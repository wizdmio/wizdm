import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContentService, AuthService, wmUserFile } from 'app/core';
import { Observable } from 'rxjs';
import { filter, take, map, tap } from 'rxjs/operators';

@Component({
  selector: 'wm-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {

  public uploads: Observable<any[]>;
  public selectedFile: wmUserFile;
  public loading: string;
  public msgs;

  constructor(private content: ContentService,
              private auth: AuthService,
              private ref: MatDialogRef<UploadsComponent>) {

    // Gets the localized content
    this.msgs = this.content.select('upload.dialog');
  }

  ngOnInit() {

    // Gets the user uploads observable
    this.uploads = this.auth.getUserUploads( ref => ref.orderBy('created') )
      // Resets the uploading progress eventually running when the list updates
      .pipe( tap( () => this.loading = null ));
  }

  public select(file: wmUserFile): void {
    this.selectedFile = file;
  }

  public upload(files: FileList): void {

    // Gets the first file
    let file = files.item(0);
    
    // Shows the uploading progress for the selected file
    // it'll be resetted when the uploads list updates
    this.loading = file.name;

    // Uploads the file and selects it when done
    this.auth.uploadUserFileOnce(file)
      .then( file => {
        this.selectedFile = file;
      }).catch( () => this.loading = null );
  }
}
