import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ContentResolver } from '../../core';
import { Observable } from 'rxjs';
import { map, switchMap, catchError, retry } from 'rxjs/operators'
import { $animations } from './static.animations';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  animations: $animations
})
export class StaticComponent {

  readonly document$: Observable<string>;
  
  constructor(private  route   : ActivatedRoute,
              private  http    : HttpClient,
              readonly content : ContentResolver) {

    // Streams the requested document
    this.document$ = this.streamDocument();
  }

  private streamDocument(): Observable<string> {

    const defaultLang = 'en';

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
              if(lang !== defaultLang && e.status === 404) { 
                // Reverts to the default language
                lang = defaultLang;
                // Trow the error down forcing a retry
                throw e;
               }
              // Redirects to NotFound when no content is found
              return this.content.navigate('not-found')
                .then( () => ''); 
            })
          )
        ), 
        // Retries once to attemp the default language, eventually
        retry(1)
      ))
    )
  }
}
