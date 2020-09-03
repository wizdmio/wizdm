import { Router, Resolve, ActivatedRouteSnapshot, ParamMap } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SelectorResolver } from '@wizdm/content';
import { map, tap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface StaticContent {
  path: string;
  body: string;
}

/** Resolves the static document content */
@Injectable()
export class StaticResolver implements Resolve<StaticContent> {

  private cache = new Map<string, StaticContent>();

  // Returns the default language of the content manager
  private get defaultLang() { return this.selector.config.defaultValue || 'en'; }
  private currentLang: string;
  
  constructor(private router: Router, private selector: SelectorResolver, private http: HttpClient) { }

  /** Resolves the content loading the requested source file */
  public resolve(route: ActivatedRouteSnapshot): Observable<StaticContent> {

    // Gets the root path from the route data
    const source = route.data.source || 'assets/doc';
    
    // Resolves the language code from the route using the content selector resolver
    const lang = this.selector.resolve(route);

    // Clears the cache switching language
    if(lang !== this.currentLang) { this.cache.clear(); }

    // Keeps track of the current language
    this.currentLang = lang;

    // Resolves the source file path from the route
    const path = this.resolvePath(route.paramMap);

    // Resolves the request from the cache whenever possible
    if(this.cache.has(path)) { return of(this.cache.get(path)); }

    console.log('Loading document:', path + '.md');

    // Loads the document .md file in the requested language folder first
    return this.http.get(`${source}/${lang}/${path}.md`, { responseType: 'text' }).pipe(

       // Catches the possible error
       catchError( (e: HttpErrorResponse) => {

        // On file not found (404)...
        if(lang !== this.defaultLang && e.status === 404) {                 
          
          console.log('404 File not found, reverting to default language:', this.defaultLang);
          
          // Loads the same document in the default language instead
          return this.http.get(`${source}/${this.defaultLang}/${path}.md`, { responseType: 'text' });
        }

        console.error('Unable to load, redirecting to not-found', e);

        this.router.navigate(['/not-found']); 

        return of('');
      }),

      // Composes the static content
      map( body => ({ body, path })),

      // Caches the content to avoid reloads
      tap( content => this.cache.set(path, content) )
    );
  }

  /** Path resolver helper */
  private resolvePath(params: ParamMap): string {
  
    return params && params.keys
    // Matches all the params starting with 'path'
    .filter( key => !!key.match(/^path\d*$/) )
    // Gets the corresponding values
    .map( key => params.get(key) )
    // Joins the parameters into the full path
    .join('/');
  }

  /** Parses the comments from source md file */
  private parseComments(source): { [key:string]: string } {

    const out = {};

    if(!source) { return out; }

    const comments = /<!--([\s\S]*?)-->/g;
    const pairs = /\s*(\w+):\s*([\w-_.\/]*)\s*/g;

    this.parse(comments, source, comment => {

      this.parse(pairs, comment[1], pair => {

        if( out[ pair[1] ] ) { return; }

        out[ pair[1] ] = pair[2];

      });
    });

    return out;
  }

  private parse(rx: RegExp, source: string, fn: (match: RegExpExecArray) => void) {

    if(typeof(fn) !== 'function') { throw new Error("fn must be a function"); }

    let match;
    while( match = rx.exec( source ) ) {

      // Prevents the zero-length match infinite loop for all browsers
      if(match.index == rx.lastIndex) { rx.lastIndex++ };

      fn(match);
    }
  }
}
