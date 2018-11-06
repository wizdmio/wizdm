import { Directive, AfterViewInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { ViewportService } from './viewport.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[wmFitToViewport]'
})
export class FitViewportDirective implements AfterViewInit, OnDestroy {

  private get native(): HTMLElement {
    return this.element.nativeElement;
  }

  constructor(private viewport : ViewportService,
              private element  : ElementRef,
              private renderer : Renderer2) { }

  private sub$: Subscription;

  ngAfterViewInit() {

    // Subscribes to always fit the element to the viewport
    this.sub$ = this.viewport.rect$.subscribe( r => {
      this.fitToRect(r);
    });
  }

  // Unsubscribe Observable
  ngOnDestroy() { this.sub$.unsubscribe();}  

  // Fits the element to the given client rectangle
  private fitToRect(rect: ClientRect): void {

    if(!rect) { return; }

    this.renderer.setStyle(this.native, 'position', 'fixed');
    this.renderer.setStyle(this.native, 'left.px', rect.left);
    this.renderer.setStyle(this.native, 'top.px', rect.top);
    this.renderer.setStyle(this.native, 'width.px', rect.width);
    this.renderer.setStyle(this.native, 'height.px', rect.height);
  }
}
