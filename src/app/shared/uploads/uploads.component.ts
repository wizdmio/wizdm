import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ContentService, UploaderService, wmUserFile } from 'app/core';
import { Observable } from 'rxjs';
import { filter, take, map, tap } from 'rxjs/operators';

@Component({
  selector: 'wm-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {

  public uploads: Observable<any[]>;
  public loading: string;
  public msgs;

  constructor(private content  : ContentService,
              private uploader : UploaderService,
              private dialog   : MatDialog) {

    // Gets the localized content
    this.msgs = this.content.select('upload.dialog');
  }

  ngOnInit() {

    // Gets the user uploads ob  servable
    this.uploads = this.uploader.queryUserUploads( ref => ref.orderBy('created') )
      // Resets the uploading progress eventually running when the list updates
      .pipe( tap( () => this.loading = null ));
  }

  public selectedFile: wmUserFile = {};

  public select(file: wmUserFile): void {
    this.selectedFile = file;
  }

  public upload(files: FileList): void {

    // Gets the first file
    let file = files.item(0);
    
    // Shows the uploading progress for the selected file
    // it'll be resetted when the uploads list updates
    this.loading = file.name;

    // Uploads t  he file and selects it when done
    this.uploader.uploadUserFileOnce(file)
      .then( file => {
        this.selectedFile = file;
      }).catch( () => this.loading = null );
  }

  @ViewChild('dialog') 
  private template : TemplateRef<UploadsComponent>;
  private config   : MatDialogConfig = { 
    width: '80vw'//,
    //data: this
  };

  @Output() file = new EventEmitter<wmUserFile>();

  /**
   * Displays the dialog to select the file among the uploads
   * @returns a Promise resolving to the selcted file only
   */
  public chooseFile(): Promise<wmUserFile> {
    return this.dialog.open(this.template, this.config)
      .afterClosed()
      .pipe( tap( file => { this.file.emit(file); }))
      .toPromise()
  }
}
