import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Scroll, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { UserProfile } from '@wizdm/connect';
import { NavigatorService, wmAction } from './navigator.service';
import { ContentResolver } from '../core';
import { Observable, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { $animations } from './navigator.animations';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  animations: $animations
})
export class NavComponent implements OnInit, OnDestroy {

  readonly scrolled$: Observable<boolean>;
  readonly msgs$: Observable<any>;
  readonly menuDesktop$: Observable<any>;
  readonly menuMobile$: Observable<any>; 
  
  constructor(private  router  : Router,
              private  profile : UserProfile,
              readonly nav     : NavigatorService,
              private  title   : Title,
              private  meta    : Meta,
              private  content : ContentResolver,
                        route  : ActivatedRoute) {

    // Gets the localized content pre-fetched by the resolver during routing
    this.msgs$ = this.content.stream("navigator");

    // Creates the observable streaming the linkbar menu items (desktop)
    this.menuDesktop$ = this.menuObservable('toolbar');

    // Creates the observable streaming the drop menu items (mobile)
    this.menuMobile$ = this.menuObservable('menu');

    // Creates and observable to monitor the scroll status
    this.scrolled$ = this.nav.viewport.scroll$.pipe(
      map( pos => pos[1] > 0 ),
      distinctUntilChanged()
    );
  }

  private sub: Subscription;

  ngOnInit() { 

    this.sub = this.msgs$.subscribe( msgs => {
      // Sets the app title when defined 
      !!msgs && !!msgs.title && this.title.setTitle(msgs.title);
      // Update the description meta-tag
      !!msgs && !!msgs.description && this.meta.updateTag({content: msgs.description}, "name='description'");
    });

    // Intercepts the NavigationEnd events
    this.sub.add( this.router.events.pipe( filter(e => e instanceof NavigationEnd) )
      .subscribe(() => {
        // Closes the nav menu at the end of each navigation
        this.toggler = false;
      }));

    // Intercepts non null router scrolling events
    this.sub.add( this.router.events.pipe( filter(e => e instanceof Scroll && !!e.anchor) )
      .subscribe( (e: Scroll) => {
        // Scroll to the routed anchor
        this.nav.viewport.scrollToAnchor(e.anchor);
      }));
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  // Menu toggle
  public toggler = false;
  public menu = false;

  public toggleMenu() {
    this.toggler = !this.toggler;
  }

  //-- Signin status -------------

  public get signedIn(): boolean {
    return this.profile.authenticated || false;
  }

  private menuObservable(key: string): Observable<any[]> {

    return this.profile.authenticated$.pipe(
      switchMap( authenticated => this.msgs$.pipe( 
        map( msgs => {
          const menu = !!msgs && msgs[key] || {};
          return authenticated ? menu.private : menu.public;
        })
      ))
    );
  }/*

  public desktopMenu(msgs: any): any[] {
    const menu = !!msgs && msgs.toolbar || {};
    return this.signedIn ? menu.private : menu.public;
  }

  public mobileMenu(msgs: any): any[] {
    const menu = !!msgs && msgs.menu || {};
    return this.signedIn ? menu.private : menu.public;
  }
*/
  public get userImage(): string {
    return this.profile.data.img;
  }

  // -- Toolbar Actions -------
  public get actionButtons$(): Observable<wmAction[]> {
    return this.nav.toolbar.buttons$;
  }

  public get someActions$(): Observable<boolean> {
    return this.nav.toolbar.some$;
  }

  public performAction(code: string): void {
    this.nav.toolbar.performAction(code);
  }

  public clearActions(): void {
    this.nav.toolbar.clearActions();
  }
}
