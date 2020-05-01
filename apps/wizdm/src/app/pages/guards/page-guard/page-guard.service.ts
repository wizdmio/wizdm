import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanPageDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
 }

@Injectable({
  providedIn: 'root'
})
export class PageGuard implements CanDeactivate<CanPageDeactivate> {

  // Implements single route deactivation
  canDeactivate(page: CanPageDeactivate) {

    // Always allow deactivation for pages not implementing the canDeactivate interface
    if(!page || !page.canDeactivate) {
      console.log('canDeactivate: Allowed');
      return true;
    }
    // Simply reverts to the current page implementation of canDeactivate interface
    return page.canDeactivate();
  }
}