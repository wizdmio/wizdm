import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ParamMap } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/** Actinng as a CanActivate guard to intercept routing actions */
@Injectable()
export class ActionLinkObserver implements CanActivate {

  private observers$ = new Subject<ActivatedRouteSnapshot>();

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Pushes the snapshot for observers to react, eventually
    this.observers$.next(route);
    // Always prevents the real routing
    return false;
  }

  /** Turns a ParamMap into an object */
  private extract(params: ParamMap): { [key: string]: string } | undefined {
    // Skips when no params are present
    if(!params || params.keys.length <= 0) { return undefined; }
    // Reduces the keys arrayn into the resulting object
    return params.keys.reduce( (obj, key) => {
      // Adds the single key, value pair
      obj[key] = params.get(key);
      return obj;
    }, {});
  }

  /** Register the observer returning the observable emitting on the specified action(s) */
  public register(...actions: string[]): Observable<{ [key: string]: string } | undefined> {

    return this.observers$.pipe( 
      // Filters the request based on the action code
      filter( request => actions.some( action => request.routeConfig.path === action ) ),
      // Emits the route's quesy parameters' map as an object
      map( route => this.extract(route.queryParamMap) )
    );
  }
}