import { Directive, ElementRef, Renderer2, ChangeDetectorRef, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Router, RouterLinkActive, RouterEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, delay } from 'rxjs/operators';

import { InkbarComponent, inkbarPosition } from './inkbar.component';

@Directive({
  selector: '[wmRouterInkbar]'
})
export class RouterInkbarDirective extends RouterLinkActive implements OnDestroy {

  private sub: Subscription;

  @Input() wmRouterInkbar: InkbarComponent;

  constructor(router: Router, private el: ElementRef, renderer: Renderer2, cdr: ChangeDetectorRef) { 
    super(router, el, renderer, cdr);

    // Applies a class '.inkbar'
    this.routerLinkActive = 'inkbar';

    // Detects router navigation end event to trigger inkbar animation
    this.sub = router.events
      .pipe( 
        // Filters navigation end events
        filter((s: RouterEvent) => s instanceof NavigationEnd), 
        // Delays the action on the next scheduler round
        delay(0),
        // Filters active links only
        filter( () => this.isActive ) 
      ).subscribe( () =>  this.updateInkbar() );
  }

  @HostListener('resize') private updateInkbar() {
    if(!!this.wmRouterInkbar && this.isActive) {
      this.wmRouterInkbar.position = this.inkbarPosition;
    }
  }

  private get inkbarPosition(): inkbarPosition {
    const e: HTMLElement = this.el.nativeElement;
    return { left: e.offsetLeft, width: e.clientWidth };// : { width: 0 };
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }
}
