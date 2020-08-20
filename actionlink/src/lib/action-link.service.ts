import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject, ReplaySubject, isObservable, from, of } from 'rxjs';
import { tap, filter, take, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { Injectable, NgModuleRef } from '@angular/core';

/** ActionLink optional data */
export interface ActionData<T = any> { 
  // Optional parameters
  [key: string]: any;
};

export interface ActionDataWithReturn<T = any> extends ActionData<T> {
  // Optional module ref when lazily loaded by loadChildren
  module?: NgModuleRef<any>,
  // Return handler
  return: (value: ActionResult<T>) => void;
}

/** ActionLink result returned by the ActionLinkExecuter */
export type ActionResult<T = any> = void|T|Promise<T>|Observable<T>;

/** Actinng as a CanActivate guard to intercept routing actions */
@Injectable({ providedIn: 'root' })
export class ActionLinkObserver implements CanActivate {

  private observers$ = new ReplaySubject<{ action: string, data?: ActionDataWithReturn }>(1);

  constructor(private router: Router) {}

  /** Register the observer returning the observable emitting on the specified action(s) */
  public register(action: string): Observable<ActionDataWithReturn> {
    // Filters the request based on the action code
    return this.observers$.pipe( filter( data => data.action === action ), pluck('data') );
  }
 
  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree {

    // Computes the action code from the route data
    const action = route.data.actionMatch || route.routeConfig.path;

    // Extracts the internal NgModule ref eventually loaded while routing according to loadChildren
    const module: NgModuleRef<any> = (route.routeConfig as any)._loadedConfig?.module;

    // Computes the data object from the route's query parameters
    const data = route.queryParamMap.keys.reduce( (data, key) => {
      // Adds the single key, value pair
      data[key] = route.queryParamMap.get(key);
      // Returns the object
      return data;
    // Adds a dummy return handler
    }, { module, return: () => {} } );
  
    // Pushes the request using data coming from the route
    this.observers$.next( { action, data } );

    // Always prevents the real routing by redirecting to the current url instead of returning false.
    // This way the router will always end up loading a page even when the requested action link comes
    // from an extrnal redirection causing the app to load from scratch.
    return this.router.parseUrl(this.router.url);
  }

  /** Activate a link programmatically */
  public activate<T>(action: string, data?: ActionData<T>): Observable<T> {

    // Builds a ReplaySubject to be used for returning values asynchronously
    const return$ = new ReplaySubject<ActionResult<T>>(1);

    // Pushes the request including a return handler
    this.observers$.next({ action, data: { 
      ...data, 
      return: (value) => return$.next(value) 
    }});

    // Returns an Observavble resolving into the returned value
    return return$.pipe( 

      // Completes the observable with the next link activation (worst case)
      takeUntil(this.observers$),
      
      // Transfors the given result
      switchMap( result => {

        // Returns thee given observable
        if(isObservable(result)) { return result as Observable<T>; }

        // Converts the Promise into observable
        if(Promise.resolve(result) == result) { return from(result as Promise<T>); }

        // Converts the value into observable
        return of(result as T);
      }),
      
      // Takes a single emission at max
      take(1)
    );
  }
}