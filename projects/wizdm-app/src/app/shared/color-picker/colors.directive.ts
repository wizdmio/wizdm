import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import { wmColor } from './colors';

@Directive({
  selector: '[wmThemeColor]'
})
export class ColorsDirective {

  constructor(private element: ElementRef, private render: Renderer2) {}

  @Input('wmThemeColor') set theme(color: wmColor) {

    try {
      this.render.setAttribute(this.element.nativeElement, 'wm-theme-color', color.color);
      this.render.setAttribute(this.element.nativeElement, 'wm-theme-contrast', color.contrast);
    }
    catch(e) { }
  }
}