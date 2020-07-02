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

/** Dynamically changes the MatButton type */
@Directive({ 
  selector: `[mat-button][type], 
             [mat-flat-button][type], 
             [mat-icon-button][type], 
             [mat-raised-button][type], 
             [mat-stroked-button][type], 
             [mat-mini-fab][type], 
             [mat-fab][type]`, 
  exportAs: 'wmButtonType' 
})
export class ButtonTypeChanger {

  private defaultType: ButtonType;
  private button: MatButton;

  constructor(@Optional() @Self() button: MatButton, @Optional() @Self() anchor: MatAnchor) {

    // Tracks the MatButton (or MatAnchor) instance
    this.button = button || anchor;

    if(!this.button) {
      throw new Error("Can't get the instance of MatButton, make sure MatButtonModule is correclty imported");
    }

    // Detects the initial button type 
    this.defaultType = this.type;
  }

  // Returns the element shared with the MatButton
  private get element(): HTMLElement { return this.button._getHostElement() as HTMLElement; }

  /** Returns the current button type based on the element's attributes */
  get type(): ButtonType {

    return (Object.keys(BUTTON_HOST_ATTRIBUTES).find( key => {
      return this.button._hasHostAttributes( BUTTON_HOST_ATTRIBUTES[key] );
    }) || 'basic') as ButtonType;
  }

  /** Switches to a different button type */
  @Input() set type(buttonType: ButtonType) {

    // Translates the input change into mat-button class/attribute changes
    const curr = BUTTON_HOST_ATTRIBUTES[buttonType || this.defaultType];
    const prev = BUTTON_HOST_ATTRIBUTES[this.type];
    
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
  }
}
