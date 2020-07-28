import { AuthPipeFactory, AuthPipe, authRedirect, customClaims } from '@wizdm/connect/auth';
import { RouterStateSnapshot } from '@angular/router';
export { AuthGuard } from "@wizdm/connect/auth"; 
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * The AuthGuard service is provided by the @wizdm/connect/auth package
 * This file contains the AuthPipe operators to customize the authorization behavior.
 */

/** Redirection helper function to use with authRedirect */
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

/** AuthPipe operator to check user for authentication redirecting to login */
export const loggedIn: AuthPipeFactory = (_, state) => map( user => !!user || redirectToLogin(state) );

/** AuthPipe operator to check user for emailVerified redirecting to login */
export const emailVerified: AuthPipeFactory = (_, state) => map( user => {

  if(!!user && user.emailVerified) { return true; }

  // Redirects to login (default) or to send the email verification request
  return redirectToLogin(state, (user && !user.emailVerified) ? 'sendEmailVerification' : undefined);
});

/** AuthPipe operator granting access based on roles */
export function authorized(roles: string[], rootEmail?: string): AuthPipe {
  
  return switchMap( user => {

    // Rejects unauthenticated users
    if(!user) { return of(false); }

    // Root email grants access when specified
    if(rootEmail && user.email === rootEmail) { 
      return of(true);
    }
    
    // Roles from custom claims are checked otherwise
    return of(user).pipe(customClaims, map( claims => roles.some(role => claims[role] ) ) );
  });
}
