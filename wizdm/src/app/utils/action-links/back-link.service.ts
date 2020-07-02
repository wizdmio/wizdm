import { Injectable, OnDestroy } from '@angular/core';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackLinkObserver extends ActionLinkObserver implements OnDestroy {

  private sub: Subscription;

  constructor(location: Location) { 
    
    super(); 

    // Registers to the 'back' actionlink to navigate back on request
    this.sub = this.register('back').subscribe( () => location.back() );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
