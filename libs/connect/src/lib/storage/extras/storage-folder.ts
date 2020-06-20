import { StorageApplication, StorageRef, UploadMetadata } from '../storage-application';
import { tap, map, scan, switchMap, shareReplay } from 'rxjs/operators';
import { StorageReference } from '../storage-reference';
import { UploadObservable } from '../upload-observable';
import { Observable, BehaviorSubject } from 'rxjs';
import { StorageFile } from './storage-file';

/** Abstacts a StorageReference as a folder to navigate or upload files into */
export class StorageFolder extends StorageReference {

  /** Internal dynamic source reference */
  private source$: BehaviorSubject<string|StorageRef>;

  /** Internal file upload subject */
  private upload$ = new BehaviorSubject<UploadObservable>(null);

  /** List of sub folders (as StorageRef) */
  readonly folders$: Observable<StorageRef[]>;

  /** List of files (as StorageFile) */
  readonly files$: Observable<StorageFile[]>;

  constructor(st: StorageApplication, path?: string|StorageRef) {
    // Constructs the parent StorageReference
    super(st, path);

    // Tracks the source to support dynamic ref changes
    this.source$ = new BehaviorSubject(this.ref);

    // Builds an intermediate observable getting the listResult
    const result$ = this.source$.pipe(
      // Updates the folder ref
      tap( ref => this.from(ref) ), 
      // Lists the folder content
      switchMap( ref => ref ? this.listAll() : null),
      // Clean-up the upload stream when a new list comes
      tap( () => this.upload$.next(null) ),
      // Shares the result between the following folders & files
      shareReplay(1)
    );

    // Builds an observable to list folders as StorageRef(s)
    this.folders$ = result$.pipe( map( result => result.prefixes ));

    // Builds an observable to list files as StorageFile(s)
    this.files$ = result$.pipe( 
      // Maps the existing items into files
      map( result => result.items.map( ref => st.file(ref) ) ),
      // Appends the new uploads when requested
      switchMap( files => this.upload$.pipe(
        // Starts the uploads and map it into a file
        map( upload => upload && st.file( upload ) ),
        // Appends the aploads to the previous list
        scan( (uploads, upload) => upload ? uploads.concat( upload ) : uploads, files)
      ))
    );
  }

  /** List the files/folders of the given path */
  public ls(path: string|StorageRef) {

    // Updates the current list from the very same path
    if(path === '.') { return this.source$.next(this.ref); }

    // Handles the '/' listing the root content
    if(path === '/') { return this.source$.next( this.ref.root ); }

    // Handles the '..' listing the parent content
    if(path === "..") { return this.source$.next( this.ref.parent ); }

    // Handles plain strings listing the 'subfolder' child
    if(typeof path === 'string') { return this.source$.next( this.ref.child( path )); }

    // Lists the given reference otherwise
    this.source$.next( path );
  }

  /** Uploads new files in the current folder */
  public upload(file: File, meta?: UploadMetadata): UploadObservable {
    
    // Creates the UploadObservable
    const up = this.child(file.name).put(file, meta);
    // Pushes the objesvable along the uploading stream and returns it to the caller
    return this.upload$.next( up ), up;
  }
}