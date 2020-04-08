import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SelectorResolver } from '@wizdm/content';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// Optional configuration
export interface StaticConfig {

  path?: string;
}

// Optional configutation token
export const STATIC_CONFIG = new InjectionToken<StaticConfig>("wizdm.static.config");

export interface StaticContent {
  body: string;
  toc?: string;
}

@Injectable()
export class StaticResolver implements Resolve<StaticContent> {

  private path; 

  constructor(private router: Router, 
              private http: HttpClient, 
              private selector: SelectorResolver,
              @Optional() @Inject(STATIC_CONFIG) config: StaticConfig) {


    // Initializes the source path according to the config oo defalts to 'assets/docs'
    this.path = !!config?.path ? (
      // Makes sure the given path ends with a slash
      config.path.endsWith('/') ? config.path : ( config.path + '/' )
      // Defaults to docs
    ) : 'assets/docs/';
  }

  // Returns the default language of the content manager
  get defaultLang() { return this.selector.config.defaultValue; }

  /** Resolves the content loading the requested source file */
  public resolve(route: ActivatedRouteSnapshot): Observable<StaticContent> {
    
    // Resolves the language code from the route using the content selector resolver
    const lang = this.selector.resolve(route);
    
    // Resolves the file name source from the route
    const page = route.paramMap.get('page');
    
    // Loads the main .md file
    return this.loadFile(lang, page).pipe(
      // Gets the body contents...
      switchMap( body => {

        // Seeks for a comment containing a reference to the table of contents file 
        // e.g. <!-- toc: fileName.md --> matches 'fileName'
        const toc = body.match(/<!--\s*toc:\s*(\w+)(?:\.md)?\s*-->/)?.[1];
        // Reverts to the body when no toc is found
        if(!toc) { return of({ body }); }
        
        // Loads the toc file
        return this.loadFile(lang, toc).pipe( 
          // And returns both the body and toc
          map( toc => ({ body, toc }) 
        ));
      }),
      
      // Redirects to NotFound when no content is found
      catchError( (e: HttpErrorResponse) => {

        if(e.status === 404) { 
          
          console.log('404 File not found, redirecting to not-found');
          // Redirects to not-found
          this.router.navigate(['/not-found']); 
        }
        
        return of({ body: '' });
      })
    );
  }

  private loadFile(lang: string, name: string): Observable<string> {

    // Computes the full path
    const fullPath = this.path + lang + '/' + name + '.md';

    // Loads the requested file first
    return this.http.get(fullPath, { responseType: 'text' }).pipe( 

      // Catches the possible error
      catchError( (e: HttpErrorResponse) => {

        // On file not found (404) of localized content...
        if(lang !== this.defaultLang && e.status === 404) { 
        
          // Reverts to the default language
          const defaultPath = this.path + this.defaultLang + '/' + name + '.md';
          
          console.log('404 File not found, reverting to default language:', defaultPath);
          
          // Loads the same document in the default language instead
          return this.http.get(defaultPath, { responseType: 'text' });
        }

        throw e;
      })
    );
  }
}
