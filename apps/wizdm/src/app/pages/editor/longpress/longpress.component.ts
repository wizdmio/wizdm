import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { EditableSelection } from '@wizdm/editable';
import { $keys } from './longpress-keymap';

@Component({
  selector: 'wm-longpress',
  templateUrl: './longpress.component.html',
  styleUrls: ['./longpress.component.scss'],
  host: { 'tabindex': '0', 'class': 'wm-theme-colors' }
})
export class LongpressComponent  {

  public keys: string[];
  public pick = 0;

  constructor(private elRef: ElementRef<HTMLElement>) { }

  /** Returns the number of available key alternatives */
  get count(): number { return !!this.keys ? this.keys.length : 0; }
  /** True when the window is displaied */
  get enabled(): boolean { return this.count > 0; }

  /** Gets the selection as input */
  @Input() sel: EditableSelection;

  /** Looks up for alternatives to the given key */
  public lookup(ev: KeyboardEvent) {
    // Rests the pick
    this.pick = 0;
    // Looks us for the alternative chars
    const keys = !!ev && $keys[ev.key];
    // Display the window eventually
    this.keys = !!keys ? keys.split('') : null;
    // Ensures the focus when needed
    this.enabled && this.focus();
  }

  /** Focus on the longpress window */
  public focus() {
    !!this.elRef && this.elRef.nativeElement.focus();
  }

  /** Types the given key in the document */
  public type(key: string) {

    if(!!this.sel) { 
      // Insert the types char in-place of the just typed one
      this.sel.back().insert(key);
    }
    // Closes the longpress window
    this.close();
  }

  // Automatically closes the window on blur
  @HostListener('blur') public close() {
    this.keys = null;
  }

  // Intercepts keys
  @HostListener('keydown', ['$event']) keyDown(ev: KeyboardEvent) {

    if(this.enabled) {

      switch(ev.key) {

        case 'Escape':
        this.close();
        break;

        case 'ArrowLeft':
        this.pick = Math.max(this.pick - 1, 0); 
        break;
        
        case 'ArrowRight': 
        this.pick = Math.min(this.pick + 1, this.count - 1); 
        break;

        case 'Enter':
        this.type(this.keys[this.pick]);
        break;

        default:

        const pick = parseInt(ev.key);
        if(pick != NaN && pick < this.count) { 
          this.type(this.keys[this.pick = pick]);
        }
      }
      // Prevents default
      return false;
    }
  }
}