import { NgModule, ModuleWithProviders, Inject } from '@angular/core';
import { RouterModule, Route, Routes, ROUTES, provideRoutes } from '@angular/router';
import { ContentConfigurator } from '../loader/content-configurator.service';
import { ContentResolver } from './content-resolver';
import { ContentModule } from '../content.module';

/** Extends routes with content */
export interface RouteWithContent extends Route {

  source?: string;
  content?: string|string[];
  children?: RoutesWithContent;
}

export type RoutesWithContent = RouteWithContent[];

// Walks doen the routes' tree applying content resolvers for the requested contents
export function resolveRoutesWithContent(routes: RoutesWithContent, source: string, selector: string = 'lang'): Routes {
  // Skips empty routes
  if(!routes) { return []; }
  // Maps the incoming routes
  return routes.map( route => {

    // Grabs the source path from the route, when defined. Defaults to the global path otherwise.
    const path = route.source || source;

    // Whenever content is defined...
    if(!!route.content) {
      // Gets the content array
      const content: string[] = typeof(route.content) === 'string' ? [route.content] : route.content;
      // Gets the resolve data map
      const resolve = route.resolve || {};
      // Builds the content resolvers map
      route.resolve = content.reduce( (resolve, file) => {
         // Adds a resolver for the given name 
        resolve[ file ] = ContentResolver.create(path, file, ContentRouterModule);
        // Next
        return resolve; 

      }, resolve );

      // Removes the source property from the route configuration
      if(!!route.source) { delete route.source; }
      // Removes the content property from the route
      delete route.content;
    }
    // Walk down to children
    if(!!route.children) { route.children = resolveRoutesWithContent(route.children, source, selector); }
    // Done
    return route;
  });
}
// Helper to flateten the multi ROUTES
export function flatten<T>(arr: T[][]): T[] {
  return Array.prototype.concat.apply([], arr);
}

@NgModule({ 
  imports: [ ContentModule, RouterModule ],
  exports: [ ContentModule, RouterModule ]
})
/** Router module with dynamic content loading  */
export class ContentRouterModule { 

  constructor(@Inject(ROUTES) routes: RoutesWithContent[], config: ContentConfigurator) {
    // Parses the routes adding content resolvers on loading beforing the actual routing accurs
    // This approach works both with JIT and AOT
    const resolvedRoutes = resolveRoutesWithContent( flatten(routes), config.source, config.selector );
  }

  /** Initializes child routes with content */
  static forChild(routes: RoutesWithContent): ModuleWithProviders<ContentRouterModule> {
    return {
      ngModule: ContentRouterModule,
      providers: [ provideRoutes(routes) ]
    };  
  }
}
