import { Observable, BehaviorSubject, of, scheduled, animationFrameScheduler } from 'rxjs';
import { filter, map, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { Member } from 'app/core/member';
import { runInZone } from 'app/utils/common';
import { ScrollableDirective } from './scroll';
import { $animations } from './navigator.animations';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  host: { 'class': 'wm-theme-colors' },
  animations: $animations
})
export class NavigatorComponent {

  // The main scrolling container
  @ViewChild(ScrollableDirective) private scroller: ScrollableDirective;

  // Background style 
  readonly background$: Observable<any>;
  private bkStyler$ = new BehaviorSubject<any>(undefined);

  // Scrolling observables
  readonly scrollTo$: Observable<string|[number, number]|HTMLElement>;
  readonly scrolled$: Observable<boolean>;
  
  // Menu togglers
  public menuToggler = false;
  public menuVisible = false;
  
  /** Observale tracking the sidenav activation status */
  readonly sideActive$: Observable<boolean>;
  private activateSide$ = new BehaviorSubject<boolean>(false);

  /** Observale tracking the sidenav open/close status */
  readonly sideOpened$: Observable<boolean>;
  private openSide$ = new BehaviorSubject<boolean>(false);
  
  // Actions
  public activateActions: any;

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

  constructor(private media: MediaObserver, 
              private router: Router,
              readonly member: Member,
              private zone: NgZone) {

    // Ensures the style being applied according to the animationFrameScheduler (so to say in-sync with the rendering)
    // preventing the notorious ExpressionChangedAfterItHasBeenChecked exception without introducing any delay the 
    // user may otherwise perceive when navigating
    this.background$ = scheduled(this.bkStyler$, animationFrameScheduler);

    // Builds the sidenav activation observable
    this.sideActive$ = scheduled(this.activateSide$.pipe( 
      
      distinctUntilChanged()
      
    ), animationFrameScheduler);

    // Builds the sidenav open/close observable
    this.sideOpened$ = scheduled(this.sideActive$.pipe( 
      
      switchMap( active => active ? this.openSide$ : of(false) ), 
      
      distinctUntilChanged()

    ), animationFrameScheduler);

    // Builds the navigation scrolling observable to be used with wmScroll directive.
    // This replaces the Angular's basic RouterScrolling mechanism for wider compatibiity.
    this.scrollTo$ = this.router.events.pipe( 
      // Filters for scroll events only
      filter( e => e instanceof Scroll ), 
      // Translates the event into the scroll target 
      map( (e: Scroll) =>  e.anchor || e.position || [0, 0] )
    );
  }

  ngAfterViewInit() {

    // Builds an observable detecting whenever the navigator main content is scrolled
    (this.scrolled$ as any) = this.scroller.elementScrolled().pipe(
      // Starts with some value to ensure triggering at start, if needed
      startWith( null ),
      // Maps to the top distance
      map( () => this.scroller.measureScrollOffset('top') > 5 ),
      // Filters for changes
      distinctUntilChanged(),
      // Enters the zone since cdk/scrolling observables run out of angular zone
      runInZone(this.zone)
    );
  }

  // Signed In status
  public get signedIn(): boolean {
    return this.member.auth.authenticated || false;
  }

  public get userImage(): string {
    return this.member.data.photo || '';
  }

  /** Applies the given style to the navigator's content background */
  public applyBackground(style: any) { this.bkStyler$.next(style); }

  /** Clears the current background  */
  public clearBackground() { this.bkStyler$.next(undefined); }

  // Toggles the menu status
  public toggleMenu() { this.menuToggler = !this.menuToggler; }

  /** True when the mobile menu is open (or closing but still visible)*/
  public get isMenuOpened() : boolean {
    return this.menuToggler || this.menuVisible;
  }

  /** True when the sidenav is active */
  public get isSidenavActive() { 
    return this.activateSide$.value; 
  }

  /** Activates the sidenav */
  public activateSidenav(active: boolean = true) { 

    this.activateSide$.next(active);
  }

  /** True when the sidenav is opened */
  public get isSidenavOpened() { 
    return this.openSide$.value || false; 
  }

  /** Opens/Closes teh sidenav wheneve active */
  public openSidenav(open: boolean = true) { 

    this.openSide$.next(open);
  }

  /** Toggles the sidenav open/close status */
  public toggleSidenav() { 

    this.openSidenav( !this.isSidenavOpened ); 
  }
}
