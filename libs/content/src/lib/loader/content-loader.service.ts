import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip, tap, catchError } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { ContentConfigurator } from './content-configurator.service';

/** Abstract ContentLoader class && DI token. Use is as a base class when creating your own custom loaders */
export abstract class ContentLoader {

  // Data snapshot keeps track of the currenlty selected language as well
  protected data: any;

  constructor(readonly config: ContentConfigurator) {}

  /** Returns the content snapshot */
  public get content(): any { return this.data || (this.data = { lang: this.config.defaultValue }); }
  
  /** Returns the current language as a two digit code */
  public get language(): string { return this.content.lang; }

  /** Checks if the requested language is allowed reverting to the default one otherwise  */
  public languageAllowed(lang: string): string {
    return this.config.supportedValues.find( allowed => allowed === lang ) || this.config.defaultValue;
  }

  /** Abstract loading module funciton */
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

    console.log('loading:', path, lang, name);

    // Resets the cache when switching language
    if(lang !== this.language) { this.data = { lang }; }

    // Returns the module from the cache whenever possible
    if(!!this.content[name]) { return of(this.content[name]); }
    
    // Extract the file name in case the extension has been specified
    const fileName = name.split('.')[0];

    // Extracts the file extension defaulting to 'json'
    const fileExt = name.split('.')[1] || 'json';

    // Detects the responseType from the file extennsion
    const responseType = fileExt.replace(/md|txt/, 'text') as 'json'|'text';

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
          catchError( () => of({}) )
          // Skips unnecessary loading
        ) : of({})

    ).pipe( 
      // Packs the result by merging the modules whenever necessary
      zip( data => this.language === this.config.defaultValue ? data[0] : this.merge(data[1], data[0]) ),
      // Caches the content for further requests
      tap( data => this.content[name] = data ),
      // Whereve happens (the requested file does not exist) returns an empty object
      catchError( () => of({}) )
    );
  }

  private merge(localModule: any, defaultModule?: any): any {
    // Skips recurring when no default module is available
    if(!!defaultModule) {
      // Loops on the keys of the default object
      Object.keys(defaultModule).forEach( key => {
        // Add the property when undefined
        if(!localModule[key]) { localModule[key] = defaultModule[key]; }
        // Override the property on array length mismatch
        else if(defaultModule[key] instanceof Array && (!(localModule[key] instanceof Array) || localModule[key].length !== defaultModule[key].length)) {
          localModule[key] = defaultModule[key]; 
        }
        // Recurs down the inner objects when needed
        else if(typeof localModule[key] === 'object') {
          localModule[key] = this.merge(localModule[key], defaultModule[key]);
        }
      });
    }
    // Returns the merged object
    return localModule;
  }
}