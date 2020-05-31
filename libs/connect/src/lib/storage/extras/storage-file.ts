import { last, take, map, zip, switchMap, startWith, endWith, shareReplay, catchError } from 'rxjs/operators';
import { Observable, of, from, BehaviorSubject, forkJoin } from 'rxjs';
import { UploadObservable, TaskState } from '../upload-observable';
import { StorageRef, FullMetadata } from '../storage-application';
import { StorageReference } from '../storage-reference';

/** Summarizes all the key information of a stored/uploading file */
export interface FileSummary extends FullMetadata {
  name: string;
  url: string;
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

  /** Builds the StorageFile */
  constructor(source?: StorageReference|UploadObservable) {

    /** Initializes teh source first */
    this.source$ = new BehaviorSubject<StorageReference|UploadObservable>(source);

    /** Builds the file name observable */
    this.name$ = this.fromSource(

      ref => of(ref.name),

      upl => upl.pipe( take(1), map( s => s.ref.name ), catchError(() => of('')) ),

      ''
    );

    /** Builds the meta content observable */
    this.meta$ = this.fromSource(
      
      ref => from( ref.getMetadata() ).pipe( startWith({} as FullMetadata) ),

      upl => upl.pipe( last(), switchMap( s => s.ref.getMetadata() ), startWith({} as FullMetadata), catchError(() => of({})) ),

      {}
      
    );

    /** Build the download url observable */
    this.url$ = this.fromSource(
      
      ref => from( ref.getDownloadURL() ).pipe( startWith('') ),

      upl => upl.pipe( last(), switchMap( s => s.ref.getDownloadURL() ), startWith(''), catchError(() => of('')) ),

      ''
    )

    /** Builds the uploading progress observable */
    this.progress$ = this.fromSource(

      ref => of(undefined),

      upl => upl.pipe( map(s => Math.floor(s.bytesTransferred / s.totalBytes * 100)), endWith(undefined), catchError(() => of(undefined)) )
    
    )

    /** Builds the file summary observable */
    this.summary$ = forkJoin(this.name$, this.meta$, this.url$).pipe(
      // Combines the previous observable
      zip( ([name, meta, url]) => ({ ...meta, name, url }) ),
      // Replays for multiple subscriptions
      shareReplay(1)
    );
  }

  /** Observable builder helper function */
  private fromSource<T>(ref: (ref: StorageReference) => Observable<T>, upl: (upl: UploadObservable) => Observable<T>, none?: T): Observable<T> {
    
    return this.source$.pipe( take(1), switchMap( source => { 

      if(source instanceof StorageReference) { return ref(source); }

      if(source instanceof UploadObservable) { return upl(source); }

      return of(none);

    }), shareReplay(1) );
  }

  /** Returns the source object */
  get source(): StorageReference|UploadObservable { return this.source$.value; }

  /** Returns the StorageRef wrapped by the source object*/
  get ref(): StorageRef { return this.source.ref; }

  /** The name of the file as per the StorageRef */
  get name(): string { return this.ref.name; }

  /** Switches to a new source */
  public from(source: StorageReference|UploadObservable) {
    this.source$.next(source);
  }

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