import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { switchMap, catchError } from 'rxjs/operators';
import { Observable, Subscription, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/** Async URI encoding @see{https://github.com/angular/angular/blob/master/packages/common/src/pipes/async_pipe.ts} */
@Pipe({ name: 'uriEncode', pure: false })
export class UriEncodePipe implements PipeTransform, OnDestroy {

  private sub: Subscription;
  private _url: string;
  private _encodedURI;

  constructor(private http: HttpClient, private ref: ChangeDetectorRef) {}

  /** Transforms the input URL into the encoded data */
  public transform(url: string): string {

    // When the url is missing reverts to undefined
    if(!url) { return this._encodedURI = undefined; }

    // Short-circuits multiple request of the very same url. 
    // This is mandatory since the pipe isn't pure
    if(this._url === url) { return this._encodedURI; }

    // Unsubscibes to the previous subscription if any
    if(this.sub) { this.sub.unsubscribe(); }

    // Encodes the file
    this.sub = this.encodeFile(this._url = url).subscribe( uri => {

      // Updates the encoded value
      this._encodedURI = uri;

      // Forces the change detection
      this.ref.markForCheck();
    });

    // Always return the latest value
    return this._encodedURI;
  }

  ngOnDestroy() {
    // Unsubscibes to the previous subscription if any
    if(this.sub) { this.sub.unsubscribe(); }
  }

  /** Gets the file and encodes its content */
  private encodeFile(url: string): Observable<string> {

    // Gets the file as a Blob
    return this.http.get(url, { responseType: "blob" }).pipe( 
      // Encodes the blob into a data string
      switchMap( blob => this.encodeDataURI(blob) ),
      // Catches possible errors
      catchError( () => of(undefined) )
    );
  }

  /** Encodes the blob */
  private encodeDataURI(blob: Blob): Observable<string> {
  
    // Wraps the FileReader into an observable
    return new Observable( sub => {

      const fr = new FileReader();
      
      fr.onerror = () => sub.error(fr.error);
      
      fr.onloadend = () => { sub.next(fr.result as string); sub.complete(); }

      fr.readAsDataURL(blob);
      
      return () => fr.abort();
    });
  }
}