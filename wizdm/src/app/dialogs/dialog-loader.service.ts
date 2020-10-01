import { Router, Route, Routes, ROUTES, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, ResolveData } from '@angular/router';
import { Observable, Subscription, isObservable, from, of, forkJoin, throwError } from 'rxjs';
import { Injectable, NgModuleRef, Type, Compiler, Injector, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActionLinkObserver, ActionData } from '@wizdm/actionlink';
import { map, switchMap, tap } from 'rxjs/operators';

/** Lazy Dialog Module Loader. Use this class as a canActivate guard within a regular lazy loading route. */
@Injectable({
  providedIn: 'root'
})
export class DialogLoader extends ActionLinkObserver implements OnDestroy {

  private readonly sub: Subscription;
  private readonly dialogs: Routes;
  
  constructor(router: Router, private injector: Injector) { 
    
    super(router);

    /** Flattens the local routes recurring down the children and filters for the ones using the DialogLoader */
    this.dialogs = this.flatten( this.routes() ).filter( ({ canActivate }) => canActivate?.indexOf( DialogLoader ) >= 0);

    /** Builds the dialogs stream */
    this.sub = this.observers$.pipe( 

      switchMap( ({ route, state }) => {

        // Extracts the dialog input data from the query parameters
        const data = this.actionData(route);

        // Loads the dialog
        return this.loadDialog<ActionData, any>( route.routeConfig, data, route, state );
      }),

    ).subscribe( value => console.log("Dialog closed returning", value) );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  /** Activate a dialog programmatically */
  public open<T, R>(dialog: string, data?: T): Promise<R> {

    // Seeks for the requested dialog within the local Routes
    const routeConfig = this.dialogs.find( ({ path }) => path === dialog );
    if(!routeConfig) { return Promise.reject( new Error(`
      Unable to find the requested dialog "${dialog}".
      Make sure the corresponding Route exists within the same module this DialogLoader instance is provided.
    `));}

    return this.loadDialog<T,R>(routeConfig, data).toPromise();
  }

  /** Lazily loads the dialog mimicking the Router from the given routeConfig */
  private loadDialog<T, R>(routeConfig: Route, data?: T, route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<R> {

    // Loads the route configuration first
    return this.loadRouteConfig(routeConfig).pipe( switchMap(({ module, routes }) => {

      // Gets the module's MatDialog instance. This is crucial to make the lazily loaded dialog to work enabling 
      // MatDialog.open() to create the component within its own module having the local injector able to provide
      // additional local directives and services.
      const dialog = module.injector.get(MatDialog);
      if(!dialog) { return throwError( new Error(`
        Unable to inject the MatDialog service from the given module "${ module.constructor }".
        Make sure your dialog module correctly imports the MatDialogModule.
      `));}

      // Seeks for the primary child route where to find the dialog component
      const root = routes.find( ({ path }) => path === '' );

      // Gets the dialog component
      const component = root?.component; 
      if(!component) { return throwError( new Error(`
        Unable to find the dialog component within the module's routes.
        Make sure your dialog module exports a root Route with an empty path as if it were a regular lazely loaded routing module.
      `));}

      // Runs the Route resolvers
      return this.runResolvers(root?.resolve, module, data, route, state).pipe(

        // Opens the dialog
        switchMap( data => {

          // Extracts the dialog configuration from the route, if any
          const config: MatDialogConfig = root.data?.dialogConfig;
          
          // Opens the dialog according to the given parameters
          return dialog.open<unknown, T, R>(component, { ...config, data }).afterClosed();
        })
      );
    }));
  }

  /** Loads the Route config */
  private loadRouteConfig(routeConfig: Route): Observable<{ module: NgModuleRef<any>, routes: Routes }> {

    // Extracts the internal NgModule ref eventually already lazily loaded by the Router
    const module: NgModuleRef<any> = (routeConfig as any)?._loadedConfig?.module;
    if(module) { 

      // Extracts the internal routes too
      const routes: Routes = (routeConfig as any)?._loadedConfig?.routes || [];

      // Returns the config data already loaded by the Router
      return of({ module, routes });
    }

    // Gets the loader function otherwise
    const loader = routeConfig.loadChildren;
    if(!loader || typeof loader !== 'function') { return throwError( new Error(`
      The matching Route "${routeConfig.path}" misses the proper loadChildren function.
    `)); 
    }

    // Loads the module file
    return from( (loader as () => Promise<Type<any>>)() ).pipe(

      // Compiles the module
      switchMap( moduleType => {

        // Gets the compiler
        const compiler = this.injector.get(Compiler);
        
        // Compiles the module asyncronously
        return compiler.compileModuleAsync(moduleType);      
      }),

      map( moduleFactory => {

        // Creates the module from the module factory
        const module = moduleFactory.create(this.injector);

        // Returns the module ref with the associated flatten routes array
        return { module, routes: this.routes(module) };
      }),

      // Saves the loaded config within the route mimicking the Router
      tap( config => (routeConfig as any)._loadedConfig = config )
    );
  }

  /** Runs the given resolvers */
  private runResolvers(resolve: ResolveData, module: NgModuleRef<any>, data?: any, route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<any> {

    // Short circuits empty ResolveData objects
    if(!resolve || Object.keys(resolve).length <= 0) {
      return of(data || {});
    }

    // Ensures a valid route/state pair to be used by resolvers
    state = state || this.router.routerState.snapshot;
    route = route || state.root.firstChild;

    // Runs all the resolvers in parallel
    return forkJoin( Object.keys(resolve).map( key => {

      // Gets the resolver instance from the module injector
      const resolver: Resolve<any> = module.injector.get(resolve[key]);
      if(typeof resolver.resolve !== 'function') { return of(null); }

      // Runs the resolver turning the results into an observable
      return this.toObservable(resolver.resolve(route, state))
        .pipe( map( data => ({ key, data }) ));

    // Composes the dialog data merging both the original query parameters from the activeLink and the resolved content
    })).pipe( map( resolvedArray => resolvedArray.reduce( (data, item) => (data[item.key] = item.data, data), data || {} ) ));
  }

  /** Flattens the give Routes recurring down the children */
  private flatten(routes: Routes): Routes {

    return routes.reduce( (flat, toFlatten) => {
      
      return flat.concat( toFlatten.children ? this.flatten(toFlatten.children) : toFlatten );

    }, [] );
  };

  /** Retrives the Routes array for the given Module defaulting to the current Module when not specified */
  private routes(module?: NgModuleRef<any>): Routes {

    // Injects the Routes (note multi is set to true)
    const routes = (module?.injector || this.injector).get(ROUTES, []);
    
    // Flattens the routes array
    return Array.prototype.concat.apply([], routes);
  }

  /** Asses the given value and return an Observable of it */
  private toObservable<T>(value: T|Promise<T>|Observable<T>): Observable<T> {

    // Returns the given observable
    if(isObservable(value)) { return value as Observable<T>; }

    // Converts the Promise into observable
    if(Promise.resolve(value) == value) { return from(value as Promise<T>); }

    // Converts the value into observable
    return of(value as T);
  }
}
