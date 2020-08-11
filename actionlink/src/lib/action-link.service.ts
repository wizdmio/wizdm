import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

/** ActionLink optional data */
export interface ActionData { 
  // Optional parameters
  [key: string]: any;
};

export interface ActionStream {

  action : string;
  route  : ActivatedRouteSnapshot;
  state  : RouterStateSnapshot;
};

/** Actinng as a CanActivate guard to intercept routing actions */
@Injectable({ providedIn: 'root' })
export class ActionLinkObserver implements CanActivate {

  readonly observers$ = new ReplaySubject<ActionStream>(1);

  constructor(protected router: Router) {}

  /** Register the observer returning the observable emitting on the specified action(s) */
  public register(action: string): Observable<ActionData> {
    
    // Returns the action observable
    return this.observers$.pipe( 
    
      // Filters the request based on the action code
      filter( data => data.action === action ), 
      
      // Extract the data from the route
      map( ({ route }) => this.actionData(route) ) 
    );
  }

  protected actionData(route: ActivatedRouteSnapshot): ActionData {

    // Computes the data object from the route's query parameters
    return route.queryParamMap.keys.reduce( (data, key) => {
      // Adds the single key, value pair
      data[key] = route.queryParamMap.get(key);
      // Returns the object
      return data;
    }, {});
  }
 
  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree {

    // Computes the action code from the route data
    const action = route.data.actionMatch || route.routeConfig.path;
  
    // Pushes the request using data coming from the route
    this.observers$.next( { action, route, state } );

    // Always prevents the real routing
    return false;
  }
}