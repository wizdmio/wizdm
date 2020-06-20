import { DataSource, CollectionViewer, SelectionModel } from '@angular/cdk/collections';
import { StorageFolder, StorageFile, FileSummary } from '@wizdm/connect/storage/extras';
import { Observable, BehaviorSubject ,forkJoin, of, combineLatest } from 'rxjs';
import { tap, map, catchError, switchMap, startWith } from 'rxjs/operators';
import { StorageService, UploadObservable } from '@wizdm/connect/storage';
import { MediaObserver } from '@angular/flex-layout';
import { AuthService } from '@wizdm/connect/auth';
import { Sort } from '@angular/material/sort';
import { Component } from '@angular/core';
import { $animations } from './upload.animations';

/** Table record */
export interface UploadRecord {
  
  /** File instance */
  file: StorageFile;
  
  /** Resolved file summary */
  data: FileSummary;

  /** Preview flags */
  previewDone?: boolean;
}

@Component({
  selector: 'wm-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss'],
  animations: $animations
})
export class UploadsComponent extends StorageFolder implements DataSource<UploadRecord> {

  /** Sorting subject */
  readonly sortBy$ = new BehaviorSubject<Sort>({ active: 'name', direction: 'asc' });
  
  /** Selection */
  private selection = new SelectionModel<UploadRecord>(true, []);

  /** Copy of all records */
  private allRecords: UploadRecord[] = [];

  /** Record to preview */
  public previewRecord: UploadRecord = null;

  /** True when the page is uploading files */
  public uploading: boolean = false;

  /** True when the page is deleting files */
  public deleting: boolean = false;

  /** True when the page is loading */
  public loading: boolean = true;
  
  /** True when the page is busy loading or deleting */
  get busy(): boolean { return this.loading || this.uploading || this.deleting; }

  /** True on small screen devices */
  get mobile(): boolean { return this.media.isActive('xs'); }

  /** List of columns to display  */
  get displayedColumns(): string[] {
    // Limited columns on small display
    return this.mobile ? ['select', 'name', 'download'] 
      // Full columns on large display
      : ['select', 'name', 'size', 'type', 'updated', 'download'];
  }

  constructor(store: StorageService, auth: AuthService, private media: MediaObserver) {

    super(store, auth.userId);
  }

  connect(viewer: CollectionViewer): Observable<UploadRecord[]> {

    //viewer.viewChange.subscribe( list => console.log(list) );

    // Lists the files from the StorageFolder
    return this.files$.pipe( 

      // Combines the StorageFile[] into UploadRecord[]
      switchMap( files => files.length > 0 ? combineLatest( files.map( file => 
        // Maps the file summary together with the file instance into records
        file.summary$.pipe( map( data => ({ file, data } as UploadRecord) ) ))
        // Skips on an empty arrays
      ) : of([])),

      // Clears the selection whenever the records change
      tap( () => { this.selection.clear(); this.previewRecord = null; } ),

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
    forkJoin( allFiles.map( file => this.upload(file, { contentType: file.type }).pipe( catchError( () => of(null) ) ) ) ).toPromise().then( uploads => {

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

      if(this.isNoneSelected()) { 
        this.allRecords.forEach( record => this.selection.select(record) ); 
      }
      else { this.selection.clear(); }
    }
  }

  /** Returns true if the given record is selected */
  public isSelected(record: UploadRecord) {
    return this.selection.isSelected(record);
  }

  /** Returns true when all files are selected */
  public isAllSelected(): boolean {
    return (this.allRecords.length > 0) && (this.allRecords.length === this.selection.selected.length);
  }

  /** Returns true when some of the files are selected */
  public isPartlySelected(): boolean {
    return (this.selection.selected.length > 0) && !this.isAllSelected();
  }

  /** Returns true when no files are selected */
  public isNoneSelected(): boolean {
    return this.allRecords.length === 0 || this.selection.selected.length <= 0;
  }

  /** Toggles the record preview */
  public togglePreview(record: UploadRecord) {

    // Previews only image files
    this.previewRecord = this.previewRecord === record ? null : (record.data?.contentType?.startsWith('image') ? record : null );
  }
}