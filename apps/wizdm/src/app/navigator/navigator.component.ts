import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Title, Meta } from '@angular/platform-browser';
import { MediaObserver } from '@angular/flex-layout';
import { UserProfile } from '@wizdm/connect';
import { ContentStreamer } from '@wizdm/content';
import { ToolbarService } from './toolbar/toolbar.service';
import { ActionLinkObserver } from '../utils';
import { FeedbackComponent } from './feedback/feedback.component';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { map, filter, distinctUntilChanged, flatMap, startWith } from 'rxjs/operators';
import { $animations } from './navigator.animations';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  host: { 'class': 'wm-navigator' },
  animations: $animations,
  providers: [ ContentStreamer ]
})
export class NavigatorComponent implements OnInit, OnDestroy {

  @ViewChild(FeedbackComponent, { static: false })
  private feedbackDialog: FeedbackComponent;

  readonly scrolled$: Observable<boolean>;  
  readonly msgs$: Observable<any>;
  private sub: Subscription;

  // Menu toggle
  public toggler = false;
  public menu = false;

  constructor(private router: Router, private media: MediaObserver, private port: ViewportRuler,
    private title: Title, 
    private meta: Meta, 
    private content: ContentStreamer,
    readonly toolbar: ToolbarService, 
    private user: UserProfile, 
    private actionLink: ActionLinkObserver) {

    // Gets the localized content pre-fetched by the resolver during routing
    this.msgs$ = this.content.stream("navigator");

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

    // Intercepts the NavigationEnd events to close the mobile menu
    this.sub.add( this.router.events.pipe( filter(e => e instanceof NavigationEnd) )
      .subscribe(() => this.toggler = false ));

      this.sub.add( this.actionLink.register('feedback').subscribe( () => {

        !!this.feedbackDialog && this.feedbackDialog.open();

      }));
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

  // Toggler satus helper (mobile)
  public toggleMenu() { this.toggler = !this.toggler; }

  // Signed In status
  public get signedIn(): boolean {
    return this.user.authenticated || false;
  }

  public get userImage(): string {
    return this.user.data.img;
  }

  public feedbackSent(success: boolean) {
    /*success ? 
      this.nav.notifyMessage('feedback/success', 'info') : 
        this.nav.notifyMessage('feedback/error');*/
  }
}
