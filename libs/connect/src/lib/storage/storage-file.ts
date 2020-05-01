import { StorageReference } from './storage-reference';
import { UploadObservable } from './upload-observable';
import { take, last, map, flatMap, startWith } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/** Helper class to display stored files */
export class StorageFile {

  readonly name$: Observable<string>;

  readonly meta$: Observable<any>;

  readonly url$: Observable<string>;
  
  readonly progress$: Observable<number>;

  constructor(ref: StorageReference|UploadObservable) {

    // Builds the StorageReference set of observables
    if(ref instanceof StorageReference) {

      this.name$ = of(ref.name);

      this.meta$ = of(ref).pipe( flatMap( ref => ref.getMetadata() ) );

      this.url$ = of(ref).pipe( flatMap( ref => ref.getDownloadURL() ) );

      this.progress$ = of(100);

      return;
    }

    // Builds the UploadObservable set of observables
    if(ref instanceof UploadObservable) {

      this.name$ = ref.pipe( take(1), map( s => s.ref.name ) );

      this.meta$ = ref.pipe( last(), flatMap( s => s.ref.getMetadata() ), startWith({}) );

      this.url$ = ref.pipe( last(), flatMap( s => s.ref.getDownloadURL() ), startWith('') );

      this.progress$ = ref.pipe( map(s => s.bytesTransferred / s.totalBytes * 100) );

      return;
    }

    // Something wrong
    this.name$ = of('');
    this.meta$ = of({});
    this.url$ = of('');
    this.progress$ = of(100);
  }
}