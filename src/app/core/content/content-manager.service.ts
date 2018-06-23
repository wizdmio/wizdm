import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable, Subscription, of, forkJoin, throwError } from 'rxjs';
import { zip, map, filter, tap, mergeMap } from 'rxjs/operators';

/*
declare interface Window {
    navigator: any;
}
declare const window: Window;
*/

export interface LanguageData {

  lang: string,
  path: string,
  label: string,
  image: string,
  default?: boolean;
};

export interface ContentConfig {

  languages: LanguageData[];
  modules: any;
};

@Injectable()
export class ContentManager implements OnDestroy {

  // Events handler notifying subscribers of:
  // reason = 'loading', loading the requetsed language files, data is null
  // resaon = 'load' language has loaded, content is in data
  // reason = 'error' some error occurred, error details are in data
  // reason = 'complete' loading completed, data is null
  //
  public events = new EventEmitter<{reason: string, data: any}>();
  public emit(ev: {reason: string, data: any}) { this.events.emit(ev);}

  private path: string = "assets/i18n/";
  private data: any = null;
  private config: ContentConfig = null;
  private lang: LanguageData = null;
  private deflang: LanguageData = null;
  private modules: string[] = null;
  private callback: (LanguageData) => void; 

  constructor(private http: HttpClient) {}

  // Instructs the ContentManager about the behaviour to 
  // execute whenever something fail during contetn loading 
  public setDefault(callbackfn: (LanguageData) => void) {
    this.callback = callbackfn;
  }

  // Executes the default handler (this is meant to be called by ContentResolver only)
  public doDefault() {
    if(this.callback) { this.callback(this.deflang); } }

  // Returns the full list of languages
  public get languages(): LanguageData[] {
    return this.config ? this.config.languages : null; }

  // Resturns the current glanguage
  public get language(): LanguageData {
    return this.lang; }

  // Checks if the requested language is already loaded
  public checkLang(lang: string): boolean {
    return this.lang.lang === lang;}

   // Loads the language configuration via http
  private init(lang?: string): Observable<ContentConfig> {

    // Short-circuit if already loaded
    if(this.config) { // Emulates a successfull http loading

      // Whenever the requested lang is specified and config is already loaded
      // init checks if the language is really available otherwise returns null  
      if( lang && !this.config.languages.find(value => value.lang === lang) ) {
        
        console.log('Requested language [' + lang + '] was not found')
        return throwError('Requested language [' + lang + '] was not found');
      }

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

  // Load the modules of the specified language
  private loadModules(lang: string, modules: string[]): Observable<any> { 

    if(modules.length <= 0) {
      return of<any>({});}

    // Uses forkJoin to http.get multiple modules in parallel
    return forkJoin<any>(

      // Turns the array of modules into an array of Observables with the relevant http.get 
      modules.map( module => {
        
        let fullPath = this.path + lang + '/' + this.config.modules[module];

        console.log('traslate loading: ' + fullPath);

        // Returns an Observable resulting from http.get mapped into a json object
        return this.http
                   .get<Object>(fullPath)
                   .pipe( map(obj => { return { name: module, object: obj}}) );
      }) 
      
    // Zips the array of resulting emissions into a single object of objects
    ).pipe( zip( objs => {

      this.data = {};// Empties the database

      // Almost done... so keeps track of the selected language
      this.lang = this.config.languages.find(item => item.lang === lang);

      // ... keeps track of the default language
      this.deflang = this.config.languages.find(item => item.default);

      //... and about the loaded modules
      this.modules = modules;

      // Finally assign the loaded objects as propoerties of data 
      objs.forEach(value => this.data[value.name] = value.object);
      return this.data;
    }));
  }

  // Loads the requested language
  public use(lang: string, modules: string[] = null): Observable<any> {

    // Notifies the loading process starting up to all the listener
    this.events.emit({reason: "loading", data: null});

    // Initialize the translation by loading the config than load all modules
    // and merge them into the parent stream (this is also known as flatMap)
    return this.init(lang).pipe( mergeMap( config => {

      if(this.lang && this.lang.lang === lang){
          
        console.log('Requested language [' + lang + '] was already loaded, skipping...');
        return of<any>(this.data);
      }

      // Loads the requested modules or all the available ones if not specified
      return this.loadModules(lang, modules || Object.keys(config.modules));

    // Catch the loading completion and notifies the listeners
    }), tap( data => { this.events.emit({reason: "load", data: data}); }, 
           error => { this.events.emit({reason: "error", data: error});}, 
           () => { this.events.emit({reason: "complete", data: this.lang});})); 
  }

  // Selects the requested portion of content data from the database
  public select(select: string, defaults?: any): any {

    if(!this.data) {
      return defaults;}
      
    return select.split(".").reduce( (value, token) => {

      if(typeof value[token] === "undefined") { 
        return defaults || value;}
          
      return value[token];
      
    }, this.data);
  }

/*
  public getBrowserCultureLang(): string {
      
    if(typeof window === 'undefined' || typeof window.navigator === 'undefined') {
        return undefined;}

    let browserCultureLang: any = window.navigator.languages ? window.navigator.languages[0] : null;
      
    browserCultureLang = browserCultureLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;

    return browserCultureLang;
  }
*/

  ngOnDestroy() {}
}
