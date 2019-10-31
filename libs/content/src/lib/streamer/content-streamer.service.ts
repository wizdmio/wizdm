import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentConfigurator } from '../loader/content-configurator.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
/** Data streamer helper. To be provided within the target component or directive decorator 
 * for the correct ActivatedRoute to be injected. */
export class ContentStreamer {

  constructor(readonly route: ActivatedRoute, readonly config: ContentConfigurator) {}
  
  /** The content data snapshot */
  get data(): any { return this.route.snapshot.data || {}; }

  /** The content data observable */
  get data$(): Observable<any> { return this.route.data; }

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
    return selector.split('.').reduce((value, token) => value && value[token], data);
  }
}