import { Component, AfterContentInit, AfterViewInit, OnDestroy, ContentChildren, QueryList, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ThemePalette } from '@angular/material/core'
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
export class RouterInkbarComponent extends InkbarComponent implements AfterViewInit, AfterContentInit, OnDestroy {

  // Query for RouterInkbarDirective children
  @ContentChildren(RouterInkbarDirective, {descendants: true})
  readonly links: QueryList<RouterInkbarDirective>;

  private sub: Subscription;

  constructor(private router: Router) { 
    
    super(); 

    // Detects router navigation end event to trigger inkbar animation
    this.sub = this.router.events.pipe( 
      // Filters navigation end events
      filter((s: RouterEvent) => s instanceof NavigationEnd), 
      // Delays the action on the next scheduler round
      delay(0),

    ).subscribe( () =>  this.update() );
  }

  ngAfterContentInit() { }

  ngAfterViewInit() {
    // Draws the inkbar at start-up after view initialization
    setTimeout( () => this.update() );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
  
  public update() {

    // Search for the active link
    const activeLink = this.links.find( link => link.isActive );

    if(!!activeLink) { this.activate(activeLink.elm); }
    else { this.clear(); }
  }
}