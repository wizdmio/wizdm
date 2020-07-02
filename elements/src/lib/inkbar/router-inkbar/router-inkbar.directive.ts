import { Directive, Input, Optional, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLinkActive, RouterLink, RouterLinkWithHref } from '@angular/router';
import { InkbarItem } from '../base-inkbar/inkbar.directive';

@Directive({
  selector: '[wmInkbarLink], [routerLinkInkbar]',
  host: { class: "wm-inkbar-link" }
})
export class RouterInkbarDirective extends RouterLinkActive implements InkbarItem {

  // Extends routerLinkActive directive
  constructor(readonly elm: ElementRef, 
                       router: Router, 
                       renderer: Renderer2, 
                       cdr: ChangeDetectorRef,
                       @Optional() link?: RouterLink, 
                       @Optional() href?: RouterLinkWithHref) { 

    // Construct the routerLinkActive
    super(router, elm, renderer, cdr, link, href);    
  }

  // Passes along the optional class(es) to apply
  @Input() set routerLinkInkbar(data: string[]|string) {
    this.routerLinkActive = data;
  }
}
