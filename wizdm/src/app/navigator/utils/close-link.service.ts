import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CloseLinkObserver implements CanActivate {

  // Returns the window object
  private get window(): Window { return this.document.defaultView || window; }
  
  constructor(@Inject(DOCUMENT) private document: Document) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 

    // Closes the window and prevents further navigations
    return this.window.close(), false;
  }
}
