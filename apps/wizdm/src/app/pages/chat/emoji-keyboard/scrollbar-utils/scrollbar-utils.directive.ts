import { Directive, Input, Optional, ElementRef, HostBinding, HostListener, NgZone } from '@angular/core';
import { first } from 'rxjs/operators';

@Directive({
  selector: '[scrollHide]',
  exportAs: 'scrollHide'
}) 
export class ScrollHide {

  public height;
  public width;

  @HostBinding('style.margin-bottom.px') get marginBottom(): number {
    return -this.height;
  }

  @HostBinding('style.margin-right.px') get marginRight(): number {
    return -this.width;
  }
}

@Directive({
  selector: '[scrollHeight]',
  exportAs: 'scrollHeight'
})
export class ScrollHeight {

  constructor(@Optional() private scrollHide: ScrollHide, private elref: ElementRef<HTMLElement>, private zone: NgZone) {

    if(!scrollHide) { throw new Error('scrollHeight must have a scrollHide parent'); } 
  }

  @HostBinding('style.height.px') value: number; 

  @HostBinding('style.padding-bottom.px') padding: number;

  /** The height of the element */
  @Input() set scrollHeight(value: number) {
    // Keeps tehe height value
    this.value = value;
    // Computes the extra padding/margin as soon as change detection ended
    this.zone.onStable.pipe( first() ).subscribe( () => this.update() );
  }
  /** Updates the extra margin/padding for the scrollbar to hide */
  private update() {
    // Gets the HTMLElement
    const el = this.elref.nativeElement;
    // Measures the height of the scrollbar to be used for extra padding
    this.padding = el.offsetHeight - el.clientHeight;
    // Inform the parent scrollHide directive about the extra height to hidden
    this.scrollHide.height = this.padding;
  }
}