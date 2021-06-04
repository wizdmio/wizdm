import { Directive, Input, Inject, HostBinding, HostListener, ElementRef } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SAMEORIGIN } from './same-origin';
import { OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';

@Directive({
  selector: 'a[download]',
  exportAs: 'wmDownload'
})
export class DownloadDirective implements OnDestroy {

  private sub: Subscription;

  /** True if something went wrong attempting to download the resource */
  public error: boolean = false;

  /** True when the request is in process */
  public busy: boolean = false;  
  
  constructor(@Inject(SAMEORIGIN) private sameOrigin: RegExp, 
                                  private http: HttpClient, 
                                  private ref: ElementRef<HTMLAnchorElement>) {}

  // Turns the 'download' attribute into an input
  @HostBinding('attr.download')
  @Input() download: string;

  // Binds to the href
  @HostBinding('href') href: string;

  // Intercepts the href
  @Input('href') set source(href: string) {

    // Resets possible errors
    this.error = false;

    // Updates the href
    this.href = href;
  }

  // Listens to the click events
  @HostListener('click') onClick() {

    // Do nothing on empty href
    if(!this.href || this.busy) { return false; }

    // Proceed with the download on files from the same origin
    if(this.error || this.sameOrigin.test(this.href)) { return true; }

    // Unsubscribes previous subscription, if any
    if(this.sub) { this.sub.unsubscribe(); }

    // Starts processing
    this.busy = true;

    // Gets the source file as a blob
    this.sub = this.http.get(this.href, { responseType: "blob" }).pipe( 

      // Converts the blob into a data url
      switchMap( blob => this.readAsDataUrl(blob) ),

      // Catches possible errors such as CORS not allowing the file download
      catchError( error => {

        // Reports the error preventing the download
        console.error("Unable to download the source file", error);

        // Tracks the error for the next round to complete anyhow
        this.error = true;
        
        // Reverts to the original href for the browser to open the file instead of downloading it
        return of(this.href);
      })

    ).subscribe( url => {

      // Updates the href with the blob url on success
      this.href = url;

      // Ends processing
      this.busy = false;

      // Triggers another click event making sure the [href] get updated
      setTimeout( () => this.ref.nativeElement.click() );
    });

    // Prevents default
    return false;
  }

  /** Asyncronously converts a blob into a data url */
  private readAsDataUrl(blob: Blob): Promise<string> {

    return new Promise( (resolve, reject) => {

      const fd = new FileReader();

      fd.onerror = () => reject(fd.error);

      fd.onload = () => resolve(fd.result as string);

      fd.readAsDataURL(blob);
    });
  }

  ngOnDestroy() { 

    // Unsubscribes the encoder
    if(this.sub) { this.sub.unsubscribe(); }
  }
}
