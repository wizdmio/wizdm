import { Router, UrlTree,CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { Observable, of, pipe, UnaryFunction } from 'rxjs';
import { AuthService, User } from '@wizdm/connect/auth';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';

export type AuthPipe = UnaryFunction<Observable<User|null>, Observable<boolean|AuthRedirect>>;

export interface AuthRedirect { commands: any[], extras?: NavigationExtras };

export const authRedirect = (commands: any[], extras?:NavigationExtras ) => ({ commands, extras });

export type AuthPipeFactory = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthPipe;


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(readonly router: Router, readonly auth: AuthService) { }

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree> {

    const authPipeFactory: AuthPipeFactory = route.data.authGuardPipe || (() => map(user => !!user));

    return this.auth.user$.pipe(

      authPipeFactory(route, state),

      map( proceedOrRedirect => {

        if(typeof proceedOrRedirect === 'boolean') { return proceedOrRedirect; }

        return this.router.createUrlTree(proceedOrRedirect.commands || ['/'], proceedOrRedirect.extras);
      }),

      take(1)
    );
  }
}

export const canActivate = (pipe: AuthPipeFactory) => ({
  canActivate: [ AuthGuard ], data: { authGuardPipe: pipe }
});

export const redirectToLogin = (state: RouterStateSnapshot, mode?: string) => {

  // Reverts navigation to the login page on invalid user profile
  console.log('canActivate: Authentication required');

  // Keeps the same language as the current url
  const lang = state.url.split('/')[1];

  // Stores the requested url
  const url = state.url;

  // Redirects to the login page passing along the target url for redirection
  return authRedirect([lang, 'login'], { queryParams: { mode, url } }); 
}


export const loggedIn: AuthPipeFactory = (route, state) => map( user => !!user || redirectToLogin(state) );

export const emailVerified: AuthPipeFactory = (route, state) => map( user => {

  if(!!user && user.emailVerified) { return true; }

  return redirectToLogin(state, user.emailVerified ? 'sendEmailVerification' : undefined);

});

