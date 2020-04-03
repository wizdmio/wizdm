import { Component, OnDestroy, Inject, Optional, ElementRef, NgZone, ErrorHandler } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Router, Scroll } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { ContentStreamer } from '@wizdm/content';
import { Member } from 'app/core/member';
import { BackgroundStyle } from './background';
import { Observable, Subscription } from 'rxjs';
import { filter, map, distinctUntilChanged, startWith, sample } from 'rxjs/operators';

import { runInZone } from 'app/utils/common';
import { $animations } from './navigator.animations';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  host: { 'class': 'wm-theme-colors' },
  animations: $animations,
  providers: [ ContentStreamer ]
})
export class NavigatorComponent extends CdkScrollable implements OnDestroy {

  readonly scrolled$: Observable<boolean>;  
  private sub: Subscription;
  
  // Menu toggle
  public menuToggler = false;
  public menuVisible = false;
  
  // Sidenav toggle
  public sideToggler = false;
  public sidenavOn: boolean = false;
  
  // Actions
  public activateActions: any;

  /** The window instance */
  private get window(): Window { return this.document.defaultView; }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

  constructor(@Inject(DOCUMENT) private document: Document, 
                                private media: MediaObserver, 
                                private router: Router,
                                readonly background$: BackgroundStyle, 
                                readonly member: Member, 
                                private zone: NgZone, 
                                private error: ErrorHandler,
                                elref: ElementRef, scroll: ScrollDispatcher, @Optional() dir: Directionality) {

    super(elref, scroll, zone, dir);

    // Creates an observable to detect whenever the navigator is scrolled
    this.scrolled$ = this.elementScrolled().pipe(
      startWith( this.measureScrollOffset('top') > 5 ),
      map( () => this.measureScrollOffset('top') > 5 ),
      distinctUntilChanged(),
      runInZone(this.zone)
    );

    // Disables browser's default scroll restoration
    if(this.window?.scrollTo && this.window?.history?.scrollRestoration) {
      this.window.history.scrollRestoration = 'manual';
    }

    // Intercepts the router's scroll event waiting for the zone to be stable, so, the anchor elements will be there.
    // This feature replaces the default Router scrolling mechanism by using CdkScrollable for a wider compatibilty
    this.sub = this.router.events.pipe( filter( e => e instanceof Scroll ), sample(zone.onStable) ).subscribe( (e: Scroll) => {

      // Scrolls to the anchor
      if(e.anchor) { this.scrollToAnchor(e.anchor); }
      // Scrolls to the given position
      else if(e.position) { 

        const [left, top] = e.position;
        
        this.scrollTo({ left, top });
      }
      // Scrolls to top otherwise
      else { this.scrollTo({ top: 0 }); }

    });
  
  }

  ngOnDestroy() {

    this.sub.unsubscribe();
    super.ngOnDestroy();
  }

  // Toggles the menu status
  public toggleMenu() { this.menuToggler = !this.menuToggler; }

  // Toggles the sidenav status
  public toggleSidenav() { this.sideToggler = !this.sideToggler; }

  public activateSidenav(active: boolean) { 

    if(this.sidenavOn = active) { return; }

    this.sideToggler = false;
  }

  // Signed In status
  public get signedIn(): boolean {
    return this.member.auth.authenticated || false;
  }

  public get userImage(): string {
    return this.member.data.photo || '';
  }

  public scrollToAnchor(anchor: string): void {

    if(!anchor) { return; }

    try { 

      // Escape anything passed to `querySelector` as it can throw errors and stop the application from working.
      anchor = this.escapeAnchor(anchor);
      
      // Scroll to the element...
      this.scrollToElement( 
        
        this.document.querySelector('#' + anchor ) || 

        this.document.querySelector(`[name='${anchor}']`)
      )

    } catch (e) { this.error.handleError(e); }
  }

  public scrollToElement(el: HTMLElement): void {

    if(!el) { return; }

    const rect = el.getBoundingClientRect();
    const left = rect.left + this.window.pageXOffset;
    const top = rect.top + this.window.pageYOffset;
    
    // Use the CdkScrollable implementation of scrollTo
    this.scrollTo({ left, top });
  }

  private escapeAnchor(anchor: string): string {

    return (this.window as any)?.CSS?.escape(anchor) || anchor.replace(/(\"|\'\ |:|\.|\[|\]|,|=)/g, '\\$1');
  }
}
