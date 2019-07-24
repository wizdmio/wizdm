import { Directive, Input, ElementRef } from '@angular/core';
import { InkbarComponent } from './inkbar.component';

@Directive({
  selector: '[wmInkbarIf]',
  host:{ class: 'wm-inkbar-item'}
})
export class InkbarDirective {

  constructor(private inkbar: InkbarComponent, readonly elm: ElementRef<HTMLElement>) { }

  public isActive: boolean;

  @Input() set wmInkbarIf(cond: boolean) {

    // Activate the parent inkbar whenever the condition is true
    if(this.isActive = cond) {
      this.inkbar.activate(this.elm);
    }
  }
}