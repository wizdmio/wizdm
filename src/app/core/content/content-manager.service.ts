import { Injectable, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { zip, map, tap, filter, take, switchMap, catchError } from 'rxjs/operators';

/** LanguageData  describes the language content 
 * @param label text label suitable for UI (menues, dropdown, ...)
 * @param path the path from where to load the language module files
 * @param image (optional) an image to represent the language (like a country flag or so)
 * @param default (optional) when true defines this as the default language
*/
export interface LanguageData {
  label: string,
  path: string,
  image?: string,
  default?: boolean
};

/** Content languages */
export type Languages = { [key: string]: LanguageData };

/** Content modules */
export type Modules = { [key: string]: string };

/** Content configuration 
 * @param languages an array of key/LanguageData pairs listing all the available languages and contents
 * @param modules assn array of key/string pairs listing the module JSON files to load
*/
export interface ContentConfig {

  languages : Languages;
  modules   : Modules;
};

export type LanguageOption = { value: string, label: string };

/** ContentEvent describes the ContentService event 
 * @param reason type of event among 
 *  'loading', loading the requetsed language files, data is null.
 *  'load' language has loaded, content is in data.
 *  'error' some error occurred, error details are in data.
 *  'complete' loading completed, data is null.
 * @param data (optional) event relatd content
*/
export interface ContentEvent {

  reason: 'loading' | 'load' | 'error' | 'complete';
  data?: any;
};

@Injectable()
/** ContentService dynamically load the application content via Http. Suitable for multi language and variable content support */
export class ContentService {

  /** Events handler notifying subscribers of several events
   * @see ContentEvent
  */
  public events = new EventEmitter<ContentEvent>();
  public emit(ev: ContentEvent) { this.events.emit(ev);}

  private path: string = "assets/i18n/";
  private config: ContentConfig = null;
  private lang: string = null;
  private data: any = {};

  constructor(private http   : HttpClient,
              private router : Router) {}

  /** Returns the full list of supported languages */
  public get languages(): Languages {
    return this.config ? this.config.languages : {}; }

  /** Resturns the current language as a two letter code such 'en' for English */
  public get language(): string {
    return this.lang; }

  /** Resturns the current language as a label suitable to be used in dropdowns and menues */
  public get languageLabel(): string {
    return this.languages[this.lang].label; 
  }

  /** Resturns the current language modules' path */
  private get languagePath(): string {
    return this.languages[this.lang].path; 
  }

  /** Resturns the current language image */
  public get languageImage(): string {
    return this.languages[this.lang].image; 
  }

  /** Returns an array of supported language codes */
  public get supportedLanguages(): string[] {
    return Object.keys(this.languages);
  }

  /** Returns the default language, if specified */
  public get defaultLanguage(): string {
    return this.supportedLanguages.find( key => {
      return this.languages[key].default;
    });
  }

  /** Returns the default language modules' path */
  private get defaultPath(): string {
    return this.languages[this.defaultLanguage].path;
  }

  /** Returns an array of supported language codes */
  public get supportedLanguageLabels(): string[] {
    return this.supportedLanguages.map( key => {
      return this.languages[key].label;
    });
  }

  /** Returns an array of language options (pairs of code/labels) */
  public get languageOptions(): LanguageOption[] {
    return this.supportedLanguages.map( value => {
      const label = this.languages[value].label;
      return { value, label };
    });
  }

  /** Checks if the requested language is supported 
   * @param lang two digit language code (es: 'en')
  */
  public isLanguageSupported(lang: string): boolean {
    return this.supportedLanguages.some( key => key == lang );
  }

  /** Return the language two letter code corresponding to the given label 
   * @param label text label associated to an available language
   * @returns a two digit language code associated with the given label or null
  */
  public matchLanguageLabel(label: string): string {
    return this.supportedLanguages.find( key => {
      return this.languages[key].label == label;
    });
  }

  /** 
   * @private Loads the language configuration via http 
   * @returns and Observable of the configuration
   * @see ContentConfig
  */
  private init(): Observable<ContentConfig> {

    // Short-circuit if already loaded
    if(this.config) { // Emulates a successfull http loading
      return of<ContentConfig>( this.config );
    }
    
    // Gets the config via http and saves it in this.config
    return this.http
               .get<ContentConfig>(this.path + 'init.json')
               .pipe(tap( cfg => { 
                
                this.config = cfg;

                console.log('translate.init():');
                console.log( JSON.stringify(this.config) );
              }));          
  }

  private loadModule(moduleName: string): Observable<any> {

    let moduleFile = this.config.modules[moduleName];
    
    console.log('Loading module: ', moduleFile);
      
    // Starts by loading the default language module
    return this.http.get<Object>(this.defaultPath + moduleFile).pipe( 
      switchMap( defaultData => {

        // Stops if the requested language corresponds to the default one
        if( this.language == this.defaultLanguage ){
          return of(defaultData);
        }

        // Loads the requested language otherwise
        return this.http.get<Object>(this.languagePath + moduleFile).pipe(
          
          // Reverts to the default language in case of errors (basically it pass an empty object 
          // since default content will be merged in the next map() )
          catchError(error => of({})),

          // Merges the requested language data with the default one to make sure
          // covering for missing translations
          map( requestedData => {
            const merged = { ...defaultData, ...requestedData };
            return merged;
          })
        );
      }),
      
      map(data => { 
        return { name: moduleName, data }; 
      })
    );
  }

  // Load the modules of the specified language
  private loadModules(modules: string[]): Observable<any> { 

    // Uses forkJoin to load the modules in parallel
    return forkJoin<any>(

      modules.map( module => this.loadModule(module) ) 
      
    // Zips the array of resulting emissions into a single object of objects
    ).pipe( zip( objs => {

      this.data = {};// Empties the database

      objs.forEach(module => { 
        this.data[module.name] = module.data;
      });

      return this.data;
    }));
  }

  // Loads the requested language
  public use(lang: string, modules: string[] = null): Observable<any> {

    // Notifies the loading process starting up to all the listener
    this.events.emit({reason: "loading", data: null});

    // Initialize the translation by loading the config than load all modules
    // and merge them into the parent stream (this is also known as flatMap)
    return this.init().pipe( 
        
      switchMap( config => {

        if(this.lang === lang) {
    
          console.log('Requested language [' + lang + '] was already loaded, skipping...');
          return of<any>(this.data);
        }

        // Check if requested language is supported or revert to the default
        if(!this.isLanguageSupported(lang)) {

          console.log('Requested language [' + lang + '] is not supported...');
          
          lang = this.defaultLanguage;
          console.log('Reverting to default:', lang);
        }
        // Sets the selected current language
        this.lang = lang;

        // Loads the requested modules or all the available ones if not specified
        return this.loadModules(modules || Object.keys(config.modules));
      }), 
      
      // Catch the loading completion and notifies the listeners
      tap(data => { this.events.emit({reason: "load", data: data });},
          error => { this.events.emit({reason: "error", data: error });},    
          () => { this.events.emit({reason: "complete", data: this.lang });}
      )
    ); 
  }

  /** Selects the requested portion of content data from the database 
   * @param select a string delimiter to select the requested portion of the content
   * @param default (optional) an optional object to be returned in the eventuality the required content is not present
   * @example let content = this.contentService.select('navigator.toolbar');
  */
  public select(select: string, defaults?: any): any {

    if(!this.data) {
      return defaults;}
      
    return select.split(".").reduce( (value, token) => {

      if(typeof value[token] === "undefined") { 
        return defaults;}
          
      return value[token];
      
    }, this.data);
  }

  /**
   * Helper function to force reloading the content while navigating to the new language
   * @param lang the new language code to switch to
   * @param url the optional relative url to navigate to. The function navigates tothe current position if not specified.
   */
  public switch(lang: string, url?: string) {

    // Checks if a language change is requested
    if(lang !== this.lang) {

      // Force reloading component strategy backing-up the current reuse strategy function
      let strategy = this.router.routeReuseStrategy.shouldReuseRoute;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;

      // Subscribe to the navigation end
      this.router.events.pipe( 
        filter( e => e instanceof NavigationEnd),
        take(1) 
      ).subscribe( () => {
        
        // Restore the original reausing strategy function after navigation completed
        this.router.routeReuseStrategy.shouldReuseRoute = strategy;
      });
    }

    const re = new RegExp(`^\/${this.lang}\/+`);

    // Computes the target path....
    let target = url ? 
    
      // ...to the requested url when specified
      `/${lang}/${url}` : 

      // ...or to the exact same page as the current one
      this.router.url.replace(re, `/${lang}/`);

    // Navigate to the target page (switching language if necessary)
    this.router.navigateByUrl(target);
  }
}
