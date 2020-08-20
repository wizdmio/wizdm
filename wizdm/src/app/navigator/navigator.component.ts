import { filter, map, tap, take, scan, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, scheduled, animationFrameScheduler } from 'rxjs';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DarkModeObserver } from 'app/utils/platform';
import { MediaObserver } from '@angular/flex-layout';
import { $animations } from './navigator.animations';
import { AdminObservable } from 'app/utils/admin';
import { Component, NgZone } from '@angular/core';
import { UserProfile } from 'app/utils/user';
import { runInZone } from '@wizdm/rxjs';
import { SidenavConfig } from './sidenav';
import { FabOptions } from './fab';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  animations: $animations
})
export class NavigatorComponent {

  // Scrolled observable
  readonly scrolled$: Observable<boolean> = of(false);

  /** Observale tracking the mobile menu status */
  readonly menuOpened$: Observable<boolean>;
  private openMenu$ = new BehaviorSubject<boolean>(false);
  
  /** Ture when the menu is opened or closing but still visible */
  public isMenuVisible = false;
  
  /** Observale tracking the sidenav activation status */
  readonly sideActive$: Observable<boolean>;
  private activateSide$ = new BehaviorSubject<boolean>(false);
  public sideOptions: SidenavConfig;

  /** Observale tracking the sidenav open/close status */
  readonly sideOpened$: Observable<boolean>;
  private openSide$ = new BehaviorSubject<boolean>(false);
  
  // Template variable to trigger the action animation
  public activateActions: any;

  // Template variable tracking the toolbar activation
  public customToolbar: any;

  // Template variable tracking the sticky footer activation
  public stickyFooter: any;

  // Template variable tracking the fab overlay activation
  public fabOverlay: any;
  public fabOverlayConfig: FabOptions;

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs'); }
  public get desktop(): boolean { return !this.mobile; }

  constructor(private media: MediaObserver, 
              private scroller: ScrollDispatcher,
              private ruler: ViewportRuler,
              readonly user: UserProfile,
              readonly admin$: AdminObservable,
              readonly dark$: DarkModeObserver,
              private zone: NgZone) {

    // Builds the mobile menu status observable
    this.menuOpened$ = scheduled(this.openMenu$.pipe( distinctUntilChanged() ), animationFrameScheduler);

    // Builds the sidenav activation observable
    this.sideActive$ = scheduled(this.activateSide$.pipe( distinctUntilChanged() ), animationFrameScheduler);

    // Builds the sidenav open/close observable
    this.sideOpened$ = scheduled(this.sideActive$.pipe( 
      // Makes sure the panel closes while not active 
      switchMap( active => active ? this.openSide$ : of(false) ), 
      // Skips unchanged values emissions
      distinctUntilChanged()
      // Runs on the next animation frame
    ), animationFrameScheduler);

    // Builds an observable detecting whenever the navigator main content is scrolled
    this.scrolled$ = this.scroller.scrolled(0).pipe(
      // Starts with some value to ensure triggering at start, if needed
      startWith( null ),
      // Filters the scrolling events from secondary cdkScollable directives
      filter( scrollable => !scrollable ),
      // Maps to the top distance
      map( () => this.ruler.getViewportScrollPosition().top > 5 ),
      // Filters for changes
      distinctUntilChanged(),
      // Enters the zone since cdk/scrolling observables run out of angular zone
      runInZone(this.zone)
    );
  }

  // Signed In status
  public get signedIn(): boolean {
    return this.user.auth.authenticated || false;
  }

  public get userImage(): string {
    return this.user.data.photo || '';
  }

  /** True when the mobile menu is open */
  public get isMenuOpened() : boolean {
    return this.openMenu$.value;
  }

  /** Opens/Closes the mobile menu */ 
  public openMenu(open: boolean = true) {
    this.openMenu$.next(open);
  }

  /** Toggles the mobile menu open/close status */
  public toggleMenu() { 
    this.openMenu$.next(!this.isMenuOpened);
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
    return this.openSide$.value; 
  }

  /** Opens/Closes the sidenav wheneve active */
  public openSidenav(open: boolean = true) { 
    this.openSide$.next(open);
  }

  /** Toggles the sidenav open/close status */
  public toggleSidenav() { 
    this.openSidenav( !this.isSidenavOpened ); 
  }
}
