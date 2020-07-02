import { Router, UrlTree,CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { Observable, UnaryFunction, pipe, from, of } from 'rxjs';
import { AuthService, User } from './auth.service';
import { Injectable } from '@angular/core';
import { take, map, switchMap } from 'rxjs/operators';

/** AuthGuard pipe operator */
export type AuthPipe = UnaryFunction<Observable<User|null>, Observable<boolean>>;

/** AuthGuard redirection object */
export interface AuthRedirect { commands: any[], extras?: NavigationExtras };

/** AuthGuard pipe operator with redirection */
export type AuthPipeWithRedirect = UnaryFunction<Observable<User|null>, Observable<boolean|AuthRedirect>>;

/** AuthGuard pipe redirection factory */
export type AuthPipeFactory = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthPipe|AuthPipeWithRedirect;

/** Checks the user for being authenticated */
export const loggedIn: AuthPipe = map( user => !!user );

/** Authentication Guard */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(readonly router: Router, readonly auth: AuthService) { }

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree> {

    // Gets the AuthPipeFactory from the route data
    const authPipeFactory: AuthPipeFactory = route.data.authGuardPipe || (() => loggedIn);

    // Returns an observable resolving the AuthState
    return this.auth.state$.pipe(

      // Builds the Auth pipe according to the route
      authPipeFactory(route, state),

      // Maps the Auth pipe results
      map( proceedOrRedirect => {

        // Returns the boolean fvalue to prevent or proceed with the navigation
        if(typeof proceedOrRedirect === 'boolean') { return proceedOrRedirect; }

        // Redirect according to the AuthRedirect
        return this.router.createUrlTree(proceedOrRedirect.commands || ['/'], proceedOrRedirect.extras);
      }),

      take(1)
    );
  }
}

/** Checks the user for having the email verified */
export const emailVerified: AuthPipe = map( user => !!user && user.emailVerified );

/** idTokenResult pipe operator */
export const idTokenResult = switchMap((user: User|null) => user ? from( user.getIdTokenResult() ) : of(null));

/** Gets the users custom claims pipe operator */
export const customClaims = pipe( idTokenResult,  map( results => results && results.claims || {} ) );

/** AuthGuard redirection helper */
export const authRedirect = (commands: any[], extras?:NavigationExtras ) => ({ commands, extras });

/** canActivate helper function */
export const canActivate = (pipe: AuthPipeFactory) => ({
  canActivate: [ AuthGuard ], data: { authGuardPipe: pipe }
});

