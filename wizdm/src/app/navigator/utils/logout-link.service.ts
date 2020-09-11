import { Injectable, OnDestroy, Inject } from '@angular/core';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { AuthService } from '@wizdm/connect/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutLinkObserver extends ActionLinkObserver implements OnDestroy {

  private sub: Subscription;

  constructor(auth: AuthService, router: Router) { 
    
    super(router); 

    // Registers to the 'close' actionlink to close the window
    this.sub = this.register('logout').subscribe( () => {

      if(!auth.authenticated) { return; }
      
      router.navigateByUrl('/').then( () => auth.signOut() );      
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
