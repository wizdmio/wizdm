import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { MediaObserver } from '@angular/flex-layout';
import { ContentStreamer } from '@wizdm/content';
import { Member } from 'app/core/member';
import { ActionLinkObserver } from 'app/utils/action-link';
import { ActionbarService } from './actionbar';
import { Observable, fromEvent } from 'rxjs';
import { map, distinctUntilChanged, startWith } from 'rxjs/operators';
import { $animations } from './navigator.animations';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  host: { 'class': 'wm-navigator' },
  animations: $animations,
  providers: [ ContentStreamer ]
})
export class NavigatorComponent {

  readonly scrolled$: Observable<boolean>;  
  
  // Menu toggle
  public menuToggler = false;
  public menuVisible = false;

  constructor(private media: MediaObserver, 
              private viewport: ViewportRuler, 
              private actionlink: ActionLinkObserver,
              private location: Location,
              readonly actionbar: ActionbarService, 
              readonly member: Member) {

    // Creates an observable to detect whenever the viewport is scrolled
    this.scrolled$ = fromEvent(window, 'scroll').pipe(
      startWith( this.viewport.getViewportScrollPosition().top > 5 ),
      map( () => this.viewport.getViewportScrollPosition().top > 5 ),
      distinctUntilChanged()
    );

    // Registers to the 'back' actionlink to navigate back on request
    this.actionlink.register('back').subscribe(() => this.location.back() );
  }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

  // Toggler satus helper (mobile)
  public toggleMenu() { this.menuToggler = !this.menuToggler; }

  // Signed In status
  public get signedIn(): boolean {
    return this.member.auth.authenticated || false;
  }

  public get userImage(): string {
    return this.member.data.photo || '';
  }
}
