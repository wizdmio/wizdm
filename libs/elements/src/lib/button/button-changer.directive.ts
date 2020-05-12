import { Directive, Input, Optional, Self } from '@angular/core';
import { MatButton, MatAnchor } from '@angular/material/button';

export type ButtonType = 'basic'|'raised'|'stroked'|'flat'|'icon'|'fab'|'mini-fab';

/** Default color for FAB and MINI FAB */
const DEFAULT_ROUND_BUTTON_COLOR = 'accent';

const BUTTON_HOST_ATTRIBUTES = {
  'basic': 'mat-button',
  'flat': 'mat-flat-button',
  'icon': 'mat-icon-button',
  'raised': 'mat-raised-button',
  'stroked': 'mat-stroked-button',
  'mini-fab': 'mat-mini-fab',
  'fab': 'mat-fab'
};

@Directive({
  selector: '[mat-button][type]',
  exportAs: 'wmButtonType'
})
export class ButtonTypeChanger {

  private buttonType: ButtonType = 'basic';
  private button: MatButton;

  constructor(@Optional() @Self() button: MatButton, @Optional() @Self() anchor: MatAnchor) {

    this.button = button || anchor;

    if(!this.button) {
      throw new Error("Can't get the instance of MatButton, make sure MatButtonModule is correclty imported");
    }
  }

  // Returns the element shared with the MatButton
  private get element(): HTMLElement { return this.button._getHostElement() as HTMLElement; }

  @Input() set type(buttonType: ButtonType) {

    // Translates teh inpu change into mat-button class/attribute changes
    const prev = BUTTON_HOST_ATTRIBUTES[this.buttonType || 'basic'];
    const curr = BUTTON_HOST_ATTRIBUTES[buttonType || 'basic'];

    // Skips no changes
    if(curr === prev) { return; }

    // Removes the old class/attribute
    this.element.classList.remove(prev);
    this.element.removeAttribute(prev);

     // Add the new class/attribute
    this.element.classList.add(curr);
    this.element.setAttribute(curr, '');

    // Updates some MatButton properties to reflect the new look
    (this.button.isIconButton as any) = curr === 'mat-icon-button';
    (this.button.isRoundButton as any) = curr === 'mat-fab' || curr === 'mat-mini-fab';
    if(this.button.isRoundButton && !this.button.color) {
      this.button.color = DEFAULT_ROUND_BUTTON_COLOR;
    }

    this.buttonType = buttonType;
  }
}
