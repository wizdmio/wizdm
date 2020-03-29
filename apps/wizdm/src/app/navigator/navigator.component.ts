import { Component, TemplateRef, NgZone } from '@angular/core';
import { ViewportRuler, ScrollDispatcher } from '@angular/cdk/scrolling';
import { MediaObserver } from '@angular/flex-layout';
import { ContentStreamer } from '@wizdm/content';
import { Member } from 'app/core/member';
import { BackgroundStyle } from './background';
import { Observable, fromEvent, animationFrameScheduler } from 'rxjs';
import { map, distinctUntilChanged, startWith } from 'rxjs/operators';
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
export class NavigatorComponent {

  //readonly actionbar$: Observable<TemplateRef<Object|null>>;
  readonly scrolled$: Observable<boolean>;  
  
  // Menu toggle
  public menuToggler = false;
  public menuVisible = false;
  
  // Sidenav toggle
  public sideToggler = false;
  public sidenavOn: boolean = false;
  
  // Actions
  public activateActions: any;
  
  constructor(private media: MediaObserver, 
              private viewport: ViewportRuler, 
              //private scroll: ScrollDispatcher,
              //private zone: NgZone,
              readonly background$: BackgroundStyle,
              readonly member: Member) {

    // Creates an observable to detect whenever the viewport is scrolled
    this.scrolled$ = fromEvent(window, 'scroll').pipe(
      startWith( this.viewport.getViewportScrollPosition().top > 5 ),
      map( () => this.viewport.getViewportScrollPosition().top > 5 ),
      distinctUntilChanged()
    );

  //this.scroll.scrollContainers.entries.
  //this.scroll.getAncestorScrollContainers

/*
    this.scrolled$ = this.scroll.scrolled().pipe(
      startWith( this.viewport.getViewportScrollPosition().top > 5 ),
      map( () => this.viewport.getViewportScrollPosition().top > 5 ),
      distinctUntilChanged(),
      runInZone(this.zone)
    );
*/
  }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

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
}
