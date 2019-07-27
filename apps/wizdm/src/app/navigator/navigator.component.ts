import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Title, Meta } from '@angular/platform-browser';
import { MediaObserver } from '@angular/flex-layout';
import { ToolbarService } from './toolbar/toolbar.service';
import { ContentResolver } from '../core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { map, filter, distinctUntilChanged, flatMap, startWith } from 'rxjs/operators';
import { $animations } from './navigator.animations';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  animations: $animations,
  host: { 'class': 'wm-navigator' }
})
export class NavigatorComponent implements OnInit, OnDestroy {

  readonly scrolled$: Observable<boolean>;  
  readonly menuDesktop$: Observable<any>;
  readonly menuMobile$: Observable<any>; 
  readonly msgs$: Observable<any>;
  private sub: Subscription;

  // Menu toggle
  public toggler = false;
  public menu = false;

  constructor(private router: Router, private media: MediaObserver, private port: ViewportRuler,
    private title: Title, private meta: Meta, private content: ContentResolver, readonly toolbar: ToolbarService) {

    // Gets the localized content pre-fetched by the resolver during routing
    this.msgs$ = this.content.stream("navigator");

    // Creates the observable streaming the linkbar menu items (desktop)
    this.menuDesktop$ = this.menuObservable('toolbar');

    // Creates the observable streaming the drop menu items (mobile)
    this.menuMobile$ = this.menuObservable('menu');

    // Creates an observable to detect whenever the viewport is scrolled
    this.scrolled$ = fromEvent(window, 'scroll').pipe(
      startWith( this.port.getViewportScrollPosition().top > 5 ),
      map( () => this.port.getViewportScrollPosition().top > 5 ),
      distinctUntilChanged()
    );
  }

  ngOnInit() { 

    // Applies localized Title and Description meta tag
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
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  private menuObservable(key: string): Observable<any[]> {

    return this.content.user.authenticated$.pipe(
      flatMap( authenticated => this.msgs$.pipe( 
        map( msgs => {
          const menu = !!msgs && msgs[key] || {};
          return authenticated ? menu.private : menu.public;
        })
      ))
    );
  }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

  // Toggler satus helper (mobile)
  public toggleMenu() { this.toggler = !this.toggler; }

  // Signed In status
  public get signedIn(): boolean {
    return this.content.user.authenticated || false;
  }

  public get userImage(): string {
    return this.content.user.data.img;
  }

  public feedbackSent(success: boolean) {
    /*success ? 
      this.nav.notifyMessage('feedback/success', 'info') : 
        this.nav.notifyMessage('feedback/error');*/
  }
}
