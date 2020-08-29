import { Injectable, OnDestroy } from '@angular/core';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackLinkObserver extends ActionLinkObserver implements OnDestroy {

  private sub: Subscription;

  constructor(location: Location, router: Router) { 
    
    super(router); 

    // Registers to the 'back' actionlink to navigate back on request
    this.sub = this.register('back').subscribe( () => location.back() );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
