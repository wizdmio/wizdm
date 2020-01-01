import { Component, AfterViewInit, OnDestroy, ContentChildren, QueryList, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { InkbarComponent } from '../inkbar/inkbar.component';
import { RouterInkbarDirective } from '../router-inkbar/router-inkbar.directive';
import { Subscription } from 'rxjs';
import { filter, delay } from 'rxjs/operators';
import { $animations } from '../inkbar/inkbar.animations';

@Component({
  selector: 'wm-router-inkbar',
  templateUrl: '../inkbar/inkbar.component.html',
  styleUrls: ['../inkbar/inkbar.component.scss'],
  host: { "class": 'wm-inkbar' },
  animations: $animations,
  encapsulation: ViewEncapsulation.None 
})
export class RouterInkbarComponent extends InkbarComponent implements AfterViewInit, OnDestroy {

  // Query for RouterInkbarDirective children
  @ContentChildren(RouterInkbarDirective, { descendants: true })
  readonly links: QueryList<RouterInkbarDirective>;
  private sub: Subscription;

  constructor(private router: Router) { super(); 

    // Detects router navigation end event to trigger inkbar animation
    this.sub = this.router.events.pipe( 
      // Filters navigation end events
      filter((s: RouterEvent) => s instanceof NavigationEnd), 
      // Delays the action on the next scheduler round 
      delay(0),

    ).subscribe( () =>  this.update() );   
  }

  // Activates the very first link on Init
  ngAfterViewInit() { this.activateLink( this.links.first ); }

  // Unsubscribes from the router observable
  ngOnDestroy() { this.sub.unsubscribe(); }
  
  // Overrides the update() reverting to the active link
  public update() {
    // Search for the active link
    this.activateLink( this.links.find( link => link.isActive ) );
  }

  private activateLink(link: RouterInkbarDirective) {

    if(!!link) { this.activate(link.elm); }
    else { this.clear(); }
  }
}
