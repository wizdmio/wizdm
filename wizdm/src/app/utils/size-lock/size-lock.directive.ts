import { Directive, Input, HostBinding } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Directive({
  selector: '[lockWidth], [lockMaxWidth]'
})
export class SizeLockDirective {

  constructor(private viewport: ViewportRuler) {
    //this.viewport.change(0).subscribe( () => console.log('change') );
  }

  @HostBinding('style.width.px') get widthStyle() { return this.width ? this.viewport.getViewportSize().width : undefined; }
  @Input() set lockWidth(width: BooleanInput) { this.width = coerceBooleanProperty(width); }
  private width: boolean = false;

  @HostBinding('style.max-width.px') get maxWidthStyle() { return this.maxWidth ? this.viewport.getViewportSize().width : undefined; }
  @Input() set lockMaxWidth(width: BooleanInput) { this.maxWidth = coerceBooleanProperty(width); }
  private maxWidth: boolean = false;

}
