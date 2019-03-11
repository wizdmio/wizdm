import { Directive, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';

import { inkbarPosition } from '../inkbar/inkbar.component';

@Directive({
  selector: '[wmRouterInkbar]'
})
export class RouterInkbarDirective extends RouterLinkActive {

  // Extends routerLinkActive directive
  constructor(router: Router, private el: ElementRef, renderer: Renderer2, cdr: ChangeDetectorRef) { 
    super(router, el, renderer, cdr);

    // Applies a class '.wm-inkbar' when active
    this.routerLinkActive = 'wm-inkbar';
  }

  // Returns the inkbarPosition based of this very element
  public get inkbarPosition(): inkbarPosition {
    const e: HTMLElement = this.el.nativeElement;
    return { left: e.offsetLeft, width: e.clientWidth };
  }
}
