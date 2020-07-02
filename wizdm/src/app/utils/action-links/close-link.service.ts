import { Injectable, OnDestroy, Inject } from '@angular/core';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloseLinkObserver extends ActionLinkObserver implements OnDestroy {

  private sub: Subscription;

  constructor(@Inject(DOCUMENT) document: Document) { 
    
    super(); 

    // Registers to the 'close' actionlink to close the window
    this.sub = this.register('close').subscribe( () => (document.defaultView || window).close() );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
