import { Injectable } from '@angular/core';
import { ContentConfigurator } from '../loader/content-configurator.service';
import { ContentLoader } from '../loader/content-loader.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Streams the data content from the local ContentLoader cache */
@Injectable()
export class ContentStreamer {

  constructor(readonly loader: ContentLoader, readonly config: ContentConfigurator) {}
    
  /** The content data snapshot */
  get data(): any { return this.loader.cache; }

  /** The content data observable */
  get data$(): Observable<any> { return this.loader.data$; }

  /** The current resolved language code */
  get language(): string { return this.data[this.config.selector]; }

  /** The current language code observable */
  get language$(): Observable<string> { return this.stream( this.config.selector ); }

  /** Streams the resolved content from the route data observable */
  public stream(selector: string = ''): Observable<any> {
    return this.data$.pipe( map( data => this.select(selector, data) ) );
  }

  /** Parses the data content returning the selected property */
  public select(selector: string, data: any = this.data): any {

    if(selector === '') { return data; }

    return selector.split('.').reduce((value, token) => {

      return (value === undefined || value === null) ? value : value[token];
    
    }, data);
  }
}