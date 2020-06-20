import { last, take, map, zip, switchMap, startWith, endWith, shareReplay, catchError } from 'rxjs/operators';
import { Observable, of, from, concat, BehaviorSubject, forkJoin, combineLatest } from 'rxjs';
import { UploadObservable, TaskState } from '../upload-observable';
import { StorageRef, FullMetadata } from '../storage-application';
import { StorageReference } from '../storage-reference';

/** Summarizes all the key information of a stored/uploading file */
export interface FileSummary extends FullMetadata {
  name: string;
  url?: string;
}

/** Helper class to display stored files */
export class StorageFile {

  /** Internal source */
  private source$: BehaviorSubject<StorageReference|UploadObservable>;
  /** File name */
  readonly name$: Observable<string>;
  /** Meta data */
  readonly meta$: Observable<FullMetadata>;
  /** Download URL */
  readonly url$: Observable<string>;
  /** Uploading progress */
  readonly progress$: Observable<number>;
  /** Overall file summary */
  readonly summary$: Observable<FileSummary>;

  /** Switches to a new source */
  public from(source: StorageReference|UploadObservable) {
    this.source$.next(source);
  }

  /** Builds the StorageFile */
  constructor(source?: StorageReference|UploadObservable) {

    /** Initializes the source first */
    this.source$ = new BehaviorSubject<StorageReference|UploadObservable>(source);

    /** Builds the file name observable */
    this.name$ = this.fromSource(

      // Simply returns the name from the storage re
      ref => of(ref.name),

      // Catches the name from the very fist snapshot
      upl => upl.pipe( take(1), map( s => s.ref.name ), catchError(() => of('')) ),

      ''
    );

    /** Builds the meta content observable */
    this.meta$ = this.fromSource(
      
      // Gets the metadata
      ref => from( ref.getMetadata() ).pipe( startWith({} as FullMetadata) ),

      // Concatenates the initial metadata (optionally sent to the server) with the full metadata from the server when done uploading  
      upl => concat(
        
        // Combines the upload metadata with the totalBytes to get a preview of the size
        upl.pipe( take(1), map( s => ({ ...s.metadata, size: s.totalBytes }) ) ), 
        
        // Gets the FullMetadata from the server
        upl.pipe( last(), switchMap( s => s.ref.getMetadata() ))
      
        // Always cathces the errors to support uploading cancellation        
      ).pipe( catchError(() => of({})) ),

      {}
    );

    /** Build the download url observable */
    this.url$ = this.fromSource(
      
      // Gets the download URL
      ref => from( ref.getDownloadURL() ).pipe( startWith('') ),

      // Waits till the end of the uploading to get the download URL
      upl => upl.pipe( last(), switchMap( s => s.ref.getDownloadURL() ), startWith(''), catchError(() => of('')) ),

      ''
    );

    /** Builds the uploading progress observable */
    this.progress$ = this.fromSource(

      // No progress
      ref => of(undefined),

      // Computes the uploading progress ending with undefined when done
      upl => upl.pipe( map(s => Math.floor(s.bytesTransferred / s.totalBytes * 100)), endWith(undefined), catchError(() => of(undefined))
      )
    );
    
    /** Builds the file summary observable */
    this.summary$ = this.fromSource(

      // Joins the previous name$/meta$/url$ observables to get a complete summary when completed
      ref => forkJoin(this.name$, this.meta$, this.url$).pipe( zip( ([name, meta, url]) => ({ ...meta, name, url }) ) ),

      // Cobines the previous name$/meta$/url$ observables get a complete summary while catching the uploading progress
      upl => combineLatest(this.name$, this.meta$, this.url$).pipe( zip( ([name, meta, url]) => ({ ...meta, name, url }) ) ) 
    );
  }

  /** Observable builder helper function */
  private fromSource<T>(ref: (ref: StorageReference) => Observable<T>, upl: (upl: UploadObservable) => Observable<T>, none?: T): Observable<T> {
    // Resolves the input source making sure to always complete
    return this.source$.pipe( take(1), switchMap( source => { 

      // Builds the relevant obervable from the StorageReference
      if(source instanceof StorageReference) { return ref(source); }

      // Builds the relevan observable from the UploadObservable
      if(source instanceof UploadObservable) { return upl(source); }

      // Defaults
      return of(none);

    }), shareReplay(1) );
  }

  /** Returns the source object */
  get source(): StorageReference|UploadObservable { return this.source$.value; }

  /** Returns the StorageRef wrapped by the source object*/
  get ref(): StorageRef { return this.source.ref; }

  /** The name of the file as per the StorageRef */
  get name(): string { return this.ref.name; }

  /** Deletes the file */
  public delete(): Promise<void> { return this.ref.delete(); }

  /** The latest status of the uploading */
  public get state(): TaskState {
    return (this.source instanceof UploadObservable) ? this.source.snapshot.state : '';
  }

  /** True during uploading */
  public get uploading(): boolean { return this.state === 'running'; }

  /** True when paused */
  public get paused(): boolean { return this.state === 'paused'; }

  /** True when canceled */
  public get canceled(): boolean { return this.state === 'canceled'; }

  /** True when suceeded */
  public get success(): boolean { return this.state === 'success'; }

  /** True on error */
  public get error(): boolean { return this.state === 'error'; }

  /** Pauses the ongoing upload */
  public pause(): boolean {
    return (this.source instanceof UploadObservable) ? this.source.pause() : false;
  }

  /** Resumes the paused upload */
  public resume(): boolean {
    return (this.source instanceof UploadObservable) ? this.source.resume() : false;
  }

  /** Cancels the ongoing upload */
  public cancel(): boolean {
    return (this.source instanceof UploadObservable) ? this.source.cancel() : false;
  }
}