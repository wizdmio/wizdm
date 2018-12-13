import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Scroll } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ObservableMedia } from '@angular/flex-layout';
import { ContentManager } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';
import { NavigatorService, wmAction } from './navigator.service';
import { Observable, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { $animations } from './navigator.animations';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  animations: $animations
})
export class NavComponent implements OnInit, OnDestroy {

  readonly msgs: any = null;
  readonly scrolled$: Observable<boolean>;
  
  constructor(private router  : Router,
              readonly media  : ObservableMedia,
              private content : ContentManager,           
              private profile : UserProfile,
              private service : NavigatorService,
              private title   : Title,
              private meta    : Meta) {

    // Gets the localized content
    this.msgs = this.content.select("navigator"); 

    // Creates and observable to monitor the scroll status
    this.scrolled$ = this.service.viewport.scroll$.pipe(
      map( pos => pos[1] > 20 ),
      distinctUntilChanged()
    );
  }

  private sub: Subscription;

  ngOnInit() { 

    // Sets the app title when defined 
    if(this.msgs.title) {
      this.title.setTitle(this.msgs.title);}

    // Update the description meta-tag
    if(this.msgs.description) {
      this.meta.updateTag({content: this.msgs.description}, "name='description'");
    }

    // Intercepts the NavigationEnd events
    this.sub = this.router.events.pipe( filter(e => e instanceof NavigationEnd) )
      .subscribe(() => {
        // Closes the nav menu at the end of each navigation
        this.toggler = false;
      });

    // Intercepts non null router scrolling events
    this.sub.add( this.router.events.pipe( filter(e => e instanceof Scroll && !!e.anchor) )
      .subscribe( (e: Scroll) => {
        // Scroll to the routed anchor
        this.service.viewport.scrollToAnchor(e.anchor);
      }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // Media query
  public get mobile(): boolean {
    return this.media.isActive('xs');// || this.media.isActive('sm'); 
  }

  public get desktop(): boolean {
    return !this.mobile;
  }

  // Menu toggle
  public toggler = false;
  public menu = false;

  public toggleMenu() {
    this.toggler = !this.toggler;
  }

  done() {
    console.log('menu done');
  }

  //-- Signin status -------------

  public get signedIn(): boolean {
    return this.profile.authenticated || false;
  }

  public get desktopMenu(): any[] {
    const menu = this.msgs.toolbar || {};
    return this.signedIn ? menu.private : menu.public;
  }

  public get mobileMenu(): any[] {
    const menu = this.msgs.menu || {};
    return this.signedIn ? menu.private : menu.public;
  }

  public get userImage(): string {
    return this.profile.data.img;
  }

  // -- Toolbar Actions -------
  public get actionButtons$(): Observable<wmAction[]> {
    return this.service.toolbar.buttons$;
  }

  public get someActions$(): Observable<boolean> {
    return this.service.toolbar.some$;
  }

  public clearActions(): void {
    this.service.toolbar.clearActions();
  }
}
