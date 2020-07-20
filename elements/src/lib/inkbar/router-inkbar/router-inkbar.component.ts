import { Component, AfterViewInit, OnDestroy, ContentChildren, ViewEncapsulation } from '@angular/core';
import { InkbarItem, InkbarDirective } from '../base-inkbar/inkbar.directive';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { RouterInkbarDirective } from './router-inkbar.directive';
import { InkbarComponent } from '../base-inkbar/inkbar.component';
import { $animations } from '../base-inkbar/inkbar.animations';
import { filter, observeOn, startWith } from 'rxjs/operators';
import { Subscription, animationFrameScheduler } from 'rxjs';
import type { QueryList } from '@angular/core';

@Component({
  selector: 'wm-router-inkbar',
  templateUrl: '../base-inkbar/inkbar.component.html',
  styleUrls: ['../base-inkbar/inkbar.component.scss'],
  host: { "class": 'wm-inkbar' },
  inputs: ['color', 'thickness', 'side'],
  outputs: ['done'],
  animations: $animations,
  encapsulation: ViewEncapsulation.None 
})
export class RouterInkbarComponent extends InkbarComponent implements AfterViewInit, OnDestroy {

  private sub: Subscription;

  // Query for RouterInkbarDirective children
  @ContentChildren(RouterInkbarDirective, { descendants: true }) readonly links: QueryList<InkbarItem>;

  // Query for base InkbarDirective children
  @ContentChildren(InkbarDirective, { descendants: true }) readonly items: QueryList<InkbarItem>;

  // Returns the active InkbarItem, if any
  get activeLink(): InkbarItem {
    // Search for the active link or item
    return this.links?.find( link => link.isActive ) || this.items?.find( link => link.isActive );
  }

  constructor(private router: Router) { super(); }
  
  ngAfterViewInit() { 

    // Always place the inkbar on the very first item. The following routing will eventually move it or clear it.
    this.activateLink(this.links.first || this.items.first);
  
    // Detects router navigation end event to trigger inkbar animation
    this.sub = this.router.events.pipe( 
      // Filters navigation end events
      filter((s: RouterEvent) => s instanceof NavigationEnd), 
      // Makes sure to always get a first hit
      startWith(null),
      // Switch to the AnimationFrame scheduler preventing ExpressionChangedAfterHasBeenChecked() exception without delaying
      observeOn(animationFrameScheduler)
      // Updates the inkbar position
    ).subscribe( link => this.update() );
  }

  // Unsubscribes from the router observable
  ngOnDestroy() { this.sub.unsubscribe(); }

  private activateLink(link: InkbarItem) {

    if(!!link) { this.activate(link.elm); }
    else { this.clear(); }
  }

  // Overrides the update() reverting to the active link
  public update() {  
    this.activateLink( this.activeLink );
  }
}
