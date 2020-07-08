import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '@wizdm/connect/auth';
import { switchMap, take } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { Injectable } from '@angular/core';

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