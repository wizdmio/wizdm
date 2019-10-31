import { InjectionToken, inject, Type } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SelectorResolver } from './selector-resolver.service';
import { ContentLoader } from '../loader/content-loader.service';
import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

/** Builds a content resolver instance for the specified source file on the fly */
export function contentResolver<T = any>(source: string, providedIn: 'root'|Type<T> = 'root') {

  return new InjectionToken(`wizdm.content.${source}`, {
    providedIn,
    factory: () => new ContentResolver(inject(SelectorResolver), inject(ContentLoader as any), source)
  });
}

/** Base resolver loading the page content according to the requested language */
export class ContentResolver implements Resolve<any> {

  constructor(readonly selector: SelectorResolver, readonly loader: ContentLoader, readonly source: string) { }

  /** Resolves the content loading the requested source file */
  public resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // Resolves the language code from the route
    const lang = this.selector.resolve(route);
    // Loads the specified module from the language forlder
    return this.loader.loadModule(lang, this.source)
      .pipe( first() );
  }
}