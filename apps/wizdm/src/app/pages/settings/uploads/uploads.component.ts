import { DataSource, CollectionViewer, SelectionModel } from '@angular/cdk/collections';
import { StorageFolder, StorageFile, FileSummary } from '@wizdm/connect/storage/extras';
import { Observable, BehaviorSubject ,forkJoin, of, combineLatest } from 'rxjs';
import { tap, map, catchError, switchMap, startWith } from 'rxjs/operators';
import { StorageService, UploadObservable } from '@wizdm/connect/storage';
import { MediaObserver } from '@angular/flex-layout';
import { AuthService } from '@wizdm/connect/auth';
import { Sort } from '@angular/material/sort';
import { Component } from '@angular/core';

export interface UploadRecord {
  file: StorageFile;
  data: FileSummary;
}

@Component({
  selector: 'wm-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent extends StorageFolder implements DataSource<UploadRecord> {

  public desktopColumns: string[] = ['select', 'name', 'size', 'type', 'updated', 'download'];
  public mobileColumns: string[] = ['select', 'name', 'download'];

  readonly sortBy$ = new BehaviorSubject<Sort>({ active: 'name', direction: 'asc' });
  
  private selection = new SelectionModel<UploadRecord>(true, []);

  private allRecords: UploadRecord[] = [];

  /** True when the page is uploading files */
  public uploading: boolean = false;

  /** True then the page is deleting files */
  public deleting: boolean = false;

  public loading: boolean = true;
  
  /** True when the page is busy loading or deleting */
  get busy(): boolean { return this.loading || this.uploading || this.deleting; }

  /** True on small screen devices */
  get mobile(): boolean { return this.media.isActive('xs'); }

  constructor(store: StorageService, auth: AuthService, private media: MediaObserver) {

    super(store, auth.userId);
  }

  connect(viewer: CollectionViewer): Observable<UploadRecord[]> {

    //viewer.viewChange.subscribe( list => console.log(list) );

    // Lists the files from the StorageFolder
    return this.files$.pipe( 

      // Combines the StorageFile[] into UploadRecord[]
      switchMap( files => combineLatest( 

        // Turns each file into an observable for the outer combineLatest to resolve
        files.map( file => ( 
          
          // Checks the source of the StorageFile
          file.source instanceof UploadObservable ? 
        
          // Starts with empty summary to catch new file uploading progress
          file.summary$.pipe( startWith({} as FileSummary) ) :

          // Go straight with the summary for StorageReference
          file.summary$

          // Maps the file/summary into records
        ).pipe( map( data => ({ file, data } as UploadRecord) ) ))
      )),

      // Clears the selection whenever the records changes
      tap( () => this.selection.clear() ),

      // Sorts the records by the given column
      switchMap( records => this.sortBy$.pipe( map( sortBy => {

        // Gets the sorting direction first
        const dir = sortBy.direction == 'asc' ? 1 : -1;

        // Sorts the array
        return records.sort((a, b) => {

          // Geta A value pushing it last when undefined (uploading?)
          const valueA = a.data[sortBy.active];
          if(!valueA) { return 1; }

          // Geta B value pushing it last when undefined (uploading?)
          const valueB = b.data[sortBy.active];
          if(!valueB) { return -1; }

          // Compares A vs B
          return (valueA > valueB) ? dir : ( (valueA < valueB) ? -dir : 0);
        });
        
      }))),
      
      // Keeps track on the full list of records
      tap( files => { this.allRecords = files; this.loading = false; } ) 
    );
  }

  disconnect(collectionViewer: CollectionViewer){ 
    this.allRecords = [];
  }

  /** Splits a FileList into an array of all files plus an array of alreadt existing files */
  private listFiles(list: FileList) {

    let allFiles: File[] = [], existingFiles: File[] = [];

    for(let i = 0; i < list.length; i++) {
      
      const item = list.item(i);

      if(this.allRecords.some( rec => rec.data.name === item.name)) { existingFiles.push(item); }
      
      allFiles.push(item);
    }

    return { allFiles, existingFiles };
  }

  /** List of files when overwriting confirmation is required. Used to open the confirmation dialog */
  public overwriteFiles: FileList;

  /** Uloads the given list of files */
  public uploadFiles(list: FileList, overwrite: boolean = false) {

    if(list.length <= 0) { return; }

    // Splits the file list in all files and already existing files
    const { allFiles, existingFiles } = this.listFiles(list);

    // Whenever some of the files already exists, ask the user for confirmation
    if(existingFiles.length > 0 && !overwrite) { this.overwriteFiles = list; return; }

    // Tracks the uploading progress
    this.uploading = true;

    // Starts uploading the given files and waits for all to complete. Catch errors since it is likely a user cancellation
    forkJoin( allFiles.map( file => this.upload(file).pipe( catchError( () => of(null) ) ) ) ).toPromise().then( uploads => {

      // Checks for overrides or cancellations to re-list the files
      if(overwrite || uploads.some( upload => upload === null)) { 
        
        this.ls("."); 
        
        this.loading = true; 
      }

      this.uploading = false;
    });
  }

  /** Deletes the selected files */
  public deleteFiles() {

    // Skips when no files are selected
    if(this.isNoneSelected()) { return; }

    // Traks the deletion process
    this.deleting = true;

    // Deletes all the selected files waiting for all to complete
    Promise.all( this.selection.selected.map( rec => rec.file.delete() ) ).then( () => {
      
      // Re-lists the files
      this.ls(".");

      this.loading = true;

      // Resets the flags
      this.deleting = false;
    });
  }

  /** Toggles the given selection. Reverts toggling the full list whenever record is omitted */
  public toggleSelection(record?: UploadRecord) {

    if(record) { this.selection.toggle(record); }
    else {

      if(this.isAllSelected()) { this.selection.clear(); }
      else { this.allRecords.forEach( record => this.selection.select(record) ); }
    }
  }

  /** Returns true if the given record is selected */
  public isSelected(record: UploadRecord) {
    return this.selection.isSelected(record);
  }

  /** Returns true when all files are selected */
  public isAllSelected(): boolean {
    return this.allRecords.length > 0 && (this.allRecords.length === this.selection.selected.length);
  }

  /** Returns true when some of the files are selected */
  public isPartlySelected(): boolean {
    return (this.selection.selected.length > 0) && !this.isAllSelected();
  }

  /** Returns true when no files are selected */
  public isNoneSelected(): boolean {
    return this.allRecords.length === 0 || this.selection.selected.length <= 0;
  }
}