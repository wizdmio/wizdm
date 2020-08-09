import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip, tap, catchError } from 'rxjs/operators';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { ContentConfigurator } from './content-configurator.service';

export interface LoaderCache {
  [key:string]: string;
  lang: string;
}

/** Abstract ContentLoader class && DI token. Use is as a base class when creating your own custom loaders */
export abstract class ContentLoader {

  // Data snapshot keeps track of the currenlty selected language as well
  protected data: LoaderCache;

  constructor(readonly config: ContentConfigurator) {}

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

  /** Abstract loading module function */
  public abstract loadFile(path: string, lang: string, name: string): Observable<any>;
}

/** Loader to load the content dynamically from JSON files */
@Injectable()
export class FileLoader extends ContentLoader {

  constructor(config: ContentConfigurator, readonly http: HttpClient) {
    super(config);
  }

  /** Load the requested module in the specified language 
   * param lang the two digit language ContentLoader
   * param moduleName the json file name to load
   */
  public loadFile(path: string, lang: string, name: string): Observable<any> {

    if(!name) { 
      throw new Error(`
        Missing file name. 
        Make sure every content statement is filled with the desired file name with an optional extension (txt or json).
      `);
    }

    // Flushes the cache when switching language
    if(lang !== this.language) { this.flush(lang); }
    
    // Extract the file name in case the extension has been specified
    const fileName = name.split('.')[0];

    // Returns the data from the cache whenever possible
    if(!!this.cache[fileName]) { return of(this.cache[fileName]); }

    // Extracts the file extension defaulting to 'json'
    const fileExt = name.split('.')[1] || 'json';

    // Checks for supported file types only
    if(!fileExt.match(/^(?:md|txt|json)$/)) {
      return throwError( new Error('Invalid file extension: ' + fileExt) );
    }

    // Detects the responseType from the file extennsion
    const responseType = fileExt.replace(/md|txt/, 'text') as 'text'|'json';

    // Let's load
    console.log('loading:', path, lang, name);

    // Always load the default module together with the requested one
    return forkJoin(
      // Default language file (full)
      this.http.request('GET',`${path}/${this.config.defaultValue}/${fileName}.${fileExt}`, { observe: 'body', responseType }),
      // Loads the requested language file only when differs from he default language
      this.language !== this.config.defaultValue ? 
        // Requested language file (partial)
        this.http.request('GET', `${path}/${this.language}/${fileName}.${fileExt}`, { observe: 'body', responseType }).pipe(
        // Reverts to the default language in case of errors (basically it pass an empty object 
        // since default content will be merged in the next map() )
          catchError( () => of(responseType === 'json' ? {} : '') )
          // Skips unnecessary loading
        ) : of(responseType === 'json' ? {} : '')

    ).pipe( 
      // Packs the result by merging the modules whenever necessary
      zip( data => this.language === this.config.defaultValue ? data[0] : this.merge(data[1], data[0], responseType) ),
      // Caches the content for further requests
      tap( data => this.cache[fileName] = data )
    );
  }

  /** Deep merges the localModule with the defaultModule */
  private merge(localModule: any, defaultModule: any, type: 'text'|'json' = 'json'): any {

    // Simply returns the not empty content when 'text' type
    if(type === 'text') { return localModule || defaultModule; }

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
