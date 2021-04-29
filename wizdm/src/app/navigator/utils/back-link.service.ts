import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BackLinkObserver implements CanActivate {

  constructor(private location: Location) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Gets back in the location history and prevents further navigation
    return this.location.back(), false;
  }
}
