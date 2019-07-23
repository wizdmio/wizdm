import { Directive, Optional, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterLinkActive, RouterLink, RouterLinkWithHref } from '@angular/router';
import { inkbarPosition } from '../inkbar/inkbar.component';

@Directive({
  selector: '[wmRouterInkbar]',
  host: { class: "wm-inkbar-link" }
})
export class RouterInkbarDirective extends RouterLinkActive {

  // Extends routerLinkActive directive
  constructor(
    router: Router, private el: ElementRef, renderer: Renderer2, 
    @Optional() link?: RouterLink,
    @Optional() href?: RouterLinkWithHref) { 

    // Construct the routerLinkActive
    super(router, el, renderer, link, href);

    // Applies a class '.active' when active
    this.routerLinkActive = '.active';
    // Makes sure the route match is exact
    this.routerLinkActiveOptions = { exact: true };
  }

  // Returns the inkbarPosition based of this very element
  public get inkbarPosition(): inkbarPosition {
    const e: HTMLElement = this.el.nativeElement;
    return { left: e.offsetLeft, width: e.clientWidth };
  }
}
