import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ViewportService } from '../../navigator';
import { ContentResolver } from '../../core';
import { Observable } from 'rxjs';
import { map, switchMap, catchError, retry } from 'rxjs/operators'

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})
export class StaticComponent {

  readonly document$: Observable<string>;
  
  constructor(private route   : ActivatedRoute,
              private http    : HttpClient,
              private scroll  : ViewportService,
              private content : ContentResolver) {

    // Streams the requested document
    this.document$ = this.streamDocument();
  }

  private streamDocument(): Observable<string> {

    // Resolves the current language first
    return this.content.language$.pipe(
      // Resolves the requested document name
      switchMap( lang => this.route.paramMap.pipe(
        // Maps the full name appending the language code
        map( param => `${param.get('name')}-${lang}`),
            // Loads the file from the assets
          switchMap( name => this.http.get(`assets/docs/${name}.md`, { responseType: 'text' })
            // Catches the possible error
            .pipe( catchError( (e: HttpErrorResponse) => {
              // On file not found (404) of localized content...
              if(lang !== 'en' && e.status === 404) { 
                // Reverts to the default language
                lang = 'en';
                // Trow the error down forcing a retry
                throw e;
               }
              // Returns a dummy content avoiding retrys
              return "# Something wrong";
            })
          )
        ), 
        // Retries the at the router level mapping the updated file name
        retry(1)
      ))
    );
  }

  public navigate(url: string) {
    // Scroll the main view at the anchor position
    //this.scroll.scrollToElement(anchor);
  }
}
