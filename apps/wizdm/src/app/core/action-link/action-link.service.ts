import { Injectable } from '@angular/core';
import { Router, UrlTree, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import { switchMap, filter, first, map, tap, zip, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActionLinkObserver implements CanActivate {

  private observers = new Subject<string>();

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {

    console.log(route, state);

    this.observers.next(route.data.action);

    return false;
  }

  public register(action: string): Observable<string> {

    return this.observers.pipe( filter( request => request === action ) );
  }
}
