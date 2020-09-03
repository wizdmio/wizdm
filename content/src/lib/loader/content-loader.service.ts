import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip, tap, catchError } from 'rxjs/operators';
import { ContentConfigurator } from './content-configurator.service';
import { Observable, ReplaySubject, of, forkJoin } from 'rxjs';

export interface LoaderCache {
  [key:string]: string;
  lang: string;
}

/** Loader to load the content dynamically from JSON files */
@Injectable()
export class ContentLoader {

  /** Content data observable */
  readonly data$ = new ReplaySubject<LoaderCache>(1);
  // Data snapshot keeps track of the currenlty selected language as well
  protected data: LoaderCache;

  constructor(readonly config: ContentConfigurator, readonly http: HttpClient) {}

  /** Returns the cached data */
  public get cache(): LoaderCache { return this.data || this.flush(); }
  
  /** Returns the current language as a two digit code */
  public get language(): string { return this.cache.lang; }

  /** Flushes the cache */
  public flush(lang: string = this.config.defaultValue): LoaderCache { return this.data = { lang }; }

  /** Checks if the requested language is allowed reverting to the default one otherwise  */
  public languageAllowed(lang: string): string {
    return this.config.supportedValues.find( allowed => allowed === lang ) || this.config.defaultValue;
  }

  /** Load the requested module in the specified language 
   * param lang the two digit language ContentLoader
   * param moduleName the json file name to load
   */
  public loadFile(path: string, lang: string, name: string): Observable<any> {

    // Flushes the cache when switching language
    if(lang !== this.language) { this.flush(lang); }

    // Returns the data from the cache whenever possible
    if(!!this.cache[name]) { return of(this.cache[name]); }

    // Let's load
    console.log('loading:', path, lang, name);

    // Always load the default module together with the requested one
    return forkJoin(
      // Default language file (full)
      this.http.get(`${path}/${this.config.defaultValue}/${name}.json`),
      // Loads the requested language file only when differs from he default language
      this.language !== this.config.defaultValue ? 
        // Requested language file (partial)
        this.http.get(`${path}/${this.language}/${name}.json`).pipe(
        // Reverts to the default language in case of errors (basically it pass an empty object 
        // since default content will be merged in the next map() )
          catchError( () => of({}) )
          // Skips unnecessary loading
        ) : of({})

    ).pipe( 
      // Packs the result by merging the modules whenever necessary
      zip( data => this.language === this.config.defaultValue ? data[0] : this.merge(data[1], data[0]) ),
      // Caches the content for further requests
      tap( data => {
        this.cache[name] = data;
        this.data$.next(this.cache);
      })
    );
  }

  /** Deep merges the localModule with the defaultModule */
  private merge(localModule: any, defaultModule: any): any {

    // Done recurring when default module is no longer available
    if(!!defaultModule) {

      // Treat arrays as a special case, so, to keep them as array
      if( Array.isArray(defaultModule) ) {

        // Overrides the locale array with tht default when they do not match
        if(!Array.isArray(localModule) || localModule.length !== defaultModule.length) {
          localModule = defaultModule; 
        }
        else { 
          // Recurs down the tree merging the array content
          defaultModule.forEach( (_, index) =>  localModule[index] = this.merge(localModule[index], defaultModule[index]) ); 
        }
      }
      else {

        // Merges the object properties otherwise
        Object.keys(defaultModule).forEach( key => {

          // Copies each missing property
          if(!localModule[key]) { localModule[key] = defaultModule[key]; }

          // Recurs down the children properties otherwise
          else if(typeof localModule[key] === 'object') {

            localModule[key] = this.merge(localModule[key], defaultModule[key]);
          }
        });
      }
    }
    // Returns the merged object
    return localModule;
  }
}