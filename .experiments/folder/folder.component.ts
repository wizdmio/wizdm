import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StorageService, StorageFile } from '@wizdm/connect/storage';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@wizdm/dialog';
import { map, flatMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';

@Component({
  selector: 'wm-folder-dlg',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent extends DialogComponent<string, StorageFile> {

  readonly files$: Observable<StorageFile[]>;

  private path$ = new Subject<string>();

  private selectedFileUrl: string = 'none';
  
  
  //public loading: string;

  constructor(private store: StorageService, dialog: MatDialog) {
    super(dialog)

    this.files$ = this.path$.pipe(

      map( path => path && this.store.ref(path) || null ),
      
      flatMap(ref =>  ref && ref.listAll() || of(null) ),

      map( result => result && result.items || [] ),

      map( items => items.map( item => this.store.file( item ) ) )
    );
  }

  @Input() set path(path: string) {
    this.path$.next(path);
  }

  // Displays the selection 'none' option
  @Input() none: boolean = true;
/*
  private get uploader(): UploaderService {
    return this.member.uploads;
  }
*/
  ngOnInit() {
/*
    // Gets the user uploads ob  servable
    this.uploads = this.uploader.stream( ref => ref.orderBy('created') )
      // Resets the uploading progress eventually running when the list updates
      .pipe( tap( () => this.loading = null ));*/
  }

  public open(url?: string) {

    this.selectFile(url || 'none');
    return super.open();
  }

  public selectFile(url: string): void {
    this.selectedFileUrl = url;
  }

  public isFileSelected(url: string): boolean {
    return this.selectedFileUrl === url;
  }

  public get selectedFile(): string {
    return this.selectedFileUrl !== 'none' ? this.selectedFileUrl : '';
  }

  public upload(files: FileList): void {
/*
    // Gets the first file
    const file = files.item(0);
    
    // Shows the uploading progress for the selected file
    // it'll be resetted when the uploads list updates
    /*this.loading = file.name;

    // Uploads t  he file and selects it when done
    this.uploader.uploadOnce(file)
      .then( file => {
        this.selectedFile = file;
      }).catch( () => this.loading = null );*/
  }

  //@Output() file = new EventEmitter<string>();

  /**
   * Displays the dialog to select the file among the uploads
   * @param an optional url of the currently selected file, if any 
   * @returns a Promise resolving to the selcted file
   */
  public chooseFile(url?: string)/*: Promise<wmFile>*/ {
/*
    // Starts by getting the already selected file if the url is specified
    return ( url ? this.uploader.streamByUrl(url).pipe( take(1) ) : of<wmFile>({}) )
      .pipe(
        switchMap( file => {
          // Keeps the previous selection
          this.selectedFile = file || {};
          // Shows the dialog for the user to select
          return this.dialog.open(this.template, this.config)
            // Returns an obbservable making sure it completes
            .afterClosed();
        }),
        // Filters unefined values (such as user pressing cancel)
        filter( file => typeof file !== 'undefined' && file !== null),
        // Emits the selection event
        tap( file => { this.file.emit(file); })
        
      ).toPromise();*/
  }

  public deleteFile(fileId: string) {
/*
    // Ask for confirmation prior to delete the file
    this.popup.confirmPopup(this.msgs.canDelete || { message: 'Please confirm' })
      .subscribe( () => {
        // DEletes the file...
        this.uploader.delete(fileId);
        // ...and select none
        this.selectedFile = {};
      });
*/
  }
}
