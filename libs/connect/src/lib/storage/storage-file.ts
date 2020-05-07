import { last, take, map, switchMap, startWith } from 'rxjs/operators';
import { Observable, of, from, BehaviorSubject } from 'rxjs';
import { StorageReference } from './storage-reference';
import { UploadObservable } from './upload-observable';

/** Helper class to display stored files */
export class StorageFile {

  /** File name */
  readonly name$: Observable<string>;
  /** Meta data */
  readonly meta$: Observable<any>;
  /** Download URL */
  readonly url$: Observable<string>;
  /** Uploading progress */
  readonly progress$: Observable<number>;

  /** Internal source */
  private source$: BehaviorSubject<StorageReference|UploadObservable>;

  /** Returns the source value */
  get source(): StorageReference|UploadObservable { 
    return this.source$.value; 
  }

  /** Switches to a new source */
  public from(source: StorageReference|UploadObservable) {
    this.source$.next(source);
  }

  /** Builds the StorageFile */
  constructor(source?: StorageReference|UploadObservable) {

    /** Initializes teh source first */
    this.source$ = new BehaviorSubject<StorageReference|UploadObservable>(source);

    /** Builds the file name observable */
    this.name$ = this.fromSource(

      ref => of(ref.name),

      upl => upl.pipe( take(1), map( s => s.ref.name ) ),

      ''
    );

    /** Builds the meta content observable */
    this.meta$ = this.fromSource(
      
      ref => from( ref.getMetadata() ),

      upl => upl.pipe( last(), switchMap( s => s.ref.getMetadata() ), startWith({}) ),

      {}
    );

    /** Build the download url observable */
    this.url$ = this.fromSource(
      
      ref => from( ref.getDownloadURL() ),

      upl => upl.pipe( last(), switchMap( s => s.ref.getDownloadURL() ), startWith('') ),

      ''
    );

    /** Builds the uploading progress observable */
    this.progress$ = this.fromSource(

      ref => of(undefined),

      upl => upl.pipe( map(s => Math.floor(s.bytesTransferred / s.totalBytes * 100)) )
    );
  }

  /** Observable builder helper function */
  private fromSource<T>(ref: (ref: StorageReference) => Observable<T>, upl: (upl: UploadObservable) => Observable<T>, none?: T): Observable<T> {
    
    return this.source$.pipe( switchMap( source => { 

      if(source instanceof StorageReference) { return ref(source); }

      if(source instanceof UploadObservable) { return upl(source); }

      return of(none);

    }));
  }
}