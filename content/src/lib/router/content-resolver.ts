import { InjectionToken, inject, Type } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SelectorResolver } from './selector-resolver.service';
import { ContentLoader } from '../loader/content-loader.service';
import { take, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/** Base resolver loading the page content according to the requested language */
export class ContentResolver implements Resolve<any> {

  /** Builds a content resolver instance for the specified source file on the fly */
  static create<T = any>(source: string, file: string, providedIn: 'root'|Type<T> = 'root') {

    return new InjectionToken(`wizdm.content.${file}`, {
      providedIn,
      factory: () => new ContentResolver(inject(ContentLoader as any), inject(SelectorResolver), source,file)
    });
  }

  constructor(readonly loader: ContentLoader, readonly selector: SelectorResolver, readonly source: string, readonly file: string) { }

  /** Resolves the content loading the requested source file */
  public resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // Resolves the language code from the route
    const lang = this.selector.resolve(route);
    // Loads the specified module from the language forlder
    return this.loader.loadFile(this.source, lang, this.file)
      .pipe( 
        // Makes sure the loading always completes to avoid the routing got stuck
        take(1),
        // Whereve happens (the requested file does not exist) returns an empty object
        catchError( () => of({}) ) 
      );
  }
}