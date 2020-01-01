import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SelectorResolver } from '@wizdm/content';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class StaticResolver implements Resolve<string> {

  constructor(private router: Router, private http: HttpClient, private selector: SelectorResolver) {}

  // Returns the default language of the content manager
  get defaultLang() { return this.selector.config.defaultValue; }

  /** Resolves the content loading the requested source file */
  public resolve(route: ActivatedRouteSnapshot): Observable<string> {

    // Resolves the language code from the route using the content selector resolver
    const lang = this.selector.resolve(route);

    // Resolves the file name source from the route
    const name = route.paramMap.get('name');

    // Computes the full path
    const fullPath = `assets/docs/${lang}/${name}.md`;

    // Loads the requested file first
    return this.http.get(fullPath, { responseType: 'text' }).pipe( 
      // Catches the possible error
      catchError( (e: HttpErrorResponse) => {

        // On file not found (404) of localized content...
        if(lang !== this.defaultLang && e.status === 404) { 
        
          // Reverts to the default language
          const defaultPath = `assets/docs/${this.defaultLang}/${name}.md`;
          
          console.log('404 File not found, reverting to default language:', defaultPath);
          
          // Loads the same document in the default language instead
          return this.http.get(defaultPath, { responseType: 'text' });
        }

        console.log('404 File not found, redirecting to not-found');
        throw e;
      }),
      // Redirects to NotFound when no content is found
      catchError( () => this.router.navigate(['/', lang, 'not-found']).then( () => '') )
    );
  }
}
