import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: 'textarea[newline]'
})
export class TextareaNewline {

  /** Selects the newline mode. 
   * - None: enter does nothig. 
   * - Always: enter always inserts a new line. 
   * - Shift: enter inserts newline in conjunction with the shift key only */
  @Input() newline: 'none'|'always'|'shift' = 'always';

  /** Intercepts the keydown event to customize the textarea behavior */
  @HostListener('keydown', ['$event']) keyDown(ev: KeyboardEvent) {

    // Prevents the default behavior according to the newline input value
    switch(ev.code === 'Enter' ? this.newline : 'always') {

      case 'none':
      return false;
      
      case 'shift':
      return ev.shiftKey;
    }

    return true;
  }

}
