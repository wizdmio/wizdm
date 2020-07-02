import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService, AuthPipe, customClaims } from '@wizdm/connect/auth';
import { switchMap, take, map } from 'rxjs/operators';
import { Observable, from, of, pipe } from 'rxjs';
import { Injectable } from '@angular/core';

/** AuthPipe operator granting access based on roles */
export const authorized = (roles: string[], rootEmail?: string) => {

  return switchMap( user => {

    // Rejects unauthenticated users
    if(!user) { return of(false); }

    // Root email grants access when specified
    if(rootEmail && user.email === rootEmail) { 
      return of(true);
    }
    
    // Roles from custom claims are checked otherwise
    return of(user).pipe(customClaims, map( claims => roles.some(role => claims[role] ) ) );
    
  }) as AuthPipe;
}

/** HTTP interceptor adding the authentication token to all the requests */
@Injectable()
export class AuthToken implements HttpInterceptor {

   constructor(private auth: AuthService) {}

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.auth.user$.pipe(
      
      take(1),
      
      switchMap( user => user ? from( user.getIdToken() ) : of(null) ),
      
      switchMap(token => {

        if(!token) { return next.handle(req); }

        return next.handle( req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) }));
      })
    )
  }
}