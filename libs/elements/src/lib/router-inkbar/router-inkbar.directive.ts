import { Directive, Input, Optional, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterLinkActive, RouterLink, RouterLinkWithHref } from '@angular/router';

@Directive({
  selector: '[wmInkbarLink],[routerLinkInkbar]',
  host: { class: "wm-inkbar-link" }
})
export class RouterInkbarDirective extends RouterLinkActive {

  // Extends routerLinkActive directive
  constructor(router: Router, readonly elm: ElementRef, renderer: Renderer2, 
    @Optional() link?: RouterLink,
    @Optional() href?: RouterLinkWithHref) { 

    // Construct the routerLinkActive
    super(router, elm, renderer, link, href);    
  }

  // Passes along the optional class(es) to apply
  @Input() set routerLinkInkbar(data: string[]|string) {
    this.routerLinkActive = data;
  }
}
