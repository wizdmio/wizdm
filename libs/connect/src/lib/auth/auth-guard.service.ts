import { Router, UrlTree,CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { Observable, UnaryFunction } from 'rxjs';
import { AuthService, User } from './auth.service';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';

/** AuthGuard pipe operator */
export type AuthPipe = UnaryFunction<Observable<User|null>, Observable<boolean|AuthRedirect>>;

/** AuthGuard redirection */
export interface AuthRedirect { commands: any[], extras?: NavigationExtras };

/** AuthGuard redirection helper */
export const authRedirect = (commands: any[], extras?:NavigationExtras ) => ({ commands, extras });

/** AuthGuard pipe redirection factory */
export type AuthPipeFactory = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthPipe;

/** Authentication Guard */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(readonly router: Router, readonly auth: AuthService) { }

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree> {

    // Gets the AuthPipeFactory from the route data
    const authPipeFactory: AuthPipeFactory = route.data.authGuardPipe || (() => map(user => !!user));

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

/** canActivate helper function */
export const canActivate = (pipe: AuthPipeFactory) => ({
  canActivate: [ AuthGuard ], data: { authGuardPipe: pipe }
});

/** Checks the user for being authenticated */
export const loggedIn: AuthPipeFactory = (route, state) => map( user => !!user );

/** Checks the user for having the email verified */
export const emailVerified: AuthPipeFactory = (route, state) => map( user => !!user && user.emailVerified );

