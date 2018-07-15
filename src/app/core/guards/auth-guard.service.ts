import { Injectable } from '@angular/core';
import { Router,
         CanActivate,
         CanActivateChild, 
         ActivatedRouteSnapshot, 
         RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ContentService } from '../content/content-manager.service';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';    

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  
  constructor(private auth: AuthService,
              private content: ContentService,
              private router: Router) {}

  // To be used for router guarding 
  canActivate( route: ActivatedRouteSnapshot, 
               state: RouterStateSnapshot
             ) : Observable<boolean> {

    console.log('AuthGuard#canActivate called');

    return this.auth.authState$.pipe( 
      map( user => user != null),
      take(1),
      tap( status => {

        console.log( "canActivate: " + status);

        if(!status) {
        
          // Store the attempted URL for redirecting
          //this.auth.redirectUrl = state.url;

          // Gets the current language when possible
          let lang = this.content.language || 'en';

          // Navigates to the login page
          this.router.navigate([lang, 'login']);
        }
      })
    );
  }

  canActivateChild( route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot 
                  ): Observable<boolean> {

    return this.canActivate(route, state);
  }
}
