import { Directive, Input, Optional, ElementRef } from '@angular/core';
import { InkbarComponent } from './inkbar.component';

export interface InkbarItem {
  elm: ElementRef<HTMLElement>;
  isActive: boolean;
}

@Directive({
  selector: '[wmInkbarIf]',
  host: { class: 'wm-inkbar-item' }
})
export class InkbarDirective implements InkbarItem {

  // Seeks for the parent InkbarComponent, if any
  constructor(@Optional() private inkbar: InkbarComponent, readonly elm: ElementRef<HTMLElement>) { }

  public isActive: boolean;

  @Input() set wmInkbarIf(cond: boolean) {

    // Tracks the condition
    this.isActive = cond;

    // Activate the parent inkbar whenever the condition is true
    if(!!this.inkbar && this.isActive) {
      this.inkbar.activate(this.elm);
    }
  }
}