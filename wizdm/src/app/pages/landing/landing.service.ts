import { ContentResolver, SelectorResolver, ContentLoader, ContentConfigurator } from '@wizdm/content';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { WidgetConfig } from './widgets/base-widget.directive'
import { Widgets } from './widgets/load-widget.directive'
import { take, switchMap } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';

/** LandingResolver. Resolves the content the same way of the standard ContentResolver after which 
 * pre-loads the requested widgets to ensure a smooth rendering of the page. */
@Injectable()
export class LandingResolver extends ContentResolver implements Resolve<any> {

  constructor(@Inject('widgets') private widgets: Widgets, loader: ContentLoader, selector: SelectorResolver, config: ContentConfigurator) { 
    // Builds the stabdard resolver first
    super(loader, selector, config.source, 'landing');
  }

  public resolve(route: ActivatedRouteSnapshot): Observable<any> {

    /** Resolves the content loading the requested source file */
    return super.resolve(route).pipe( switchMap( config => {

      // Extracts the widget configurations
      const widgets: WidgetConfig[] = config.widgets || [];

      // If none, skips
      if(widgets.length <= 0) { return of(config); }

      // Pre-loads the widget components prior to return the content
      return Promise.all( widgets.map( w => this.widgets.find( ww => ww.type === w.type )?.loadComponent() ) )
        .then( () => config );
    }));
  }

}
