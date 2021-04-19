import { Component, Input, HostListener, ElementRef, Inject } from '@angular/core';
import { LongPressKeyMap, LONGPRESS_KEYMAP } from './longpress-keymap';
import { EditableSelection } from '@wizdm/editable/document';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'wm-longpress',
  templateUrl: './longpress.component.html',
  styleUrls: ['./longpress.component.scss'],
  host: { 
    'tabindex': '0', 
    '[attr.color]': 'color',
    '[style.left.px]': 'left',
    '[style.top.px]': 'top'
  }
})
export class LongPressComponent  {

  public left: number = undefined;
  public top: number = undefined;
  public keys: string[];
  public pick = 0;

  constructor(private elRef: ElementRef<HTMLElement>, @Inject(LONGPRESS_KEYMAP) private keyMap: LongPressKeyMap) { }

  /** Returns the number of available key alternatives */
  get count(): number { return !!this.keys ? this.keys.length : 0; }

  /** True when the window is displayed */
  get enabled(): boolean { return this.count > 0; }

  private get height(): number {
    return this.elRef.nativeElement.clientHeight || 0;
  }

  /** Gets the selection as input */
  @Input() sel: EditableSelection;

  /** Gets the caret position */
  @Input() caret: ClientRect;

  /** Theme color */
  @Input() color: ThemePalette;

  /** Lookup */
  @Input('lookup') set _lookup(ev: KeyboardEvent) {
    this.lookup(ev);
  }

  /** Looks up for alternatives to the given key */
  public lookup(ev: KeyboardEvent) {
    // Rests the pick
    this.pick = 0;
    // Looks us for the alternative chars
    const keys = !!ev && this.keyMap[ev.key];
    // Display the window eventually
    this.keys = !!keys ? keys.split('') : null;
    // Ensures the focus when needed
    this.enabled && this.focus();

    // Updates the position whenever the component rendered
    setTimeout(() => {
      this.left = this.caret ? Math.max(this.caret.left - 8, 0) : undefined;
      this.top = this.caret ? Math.max(this.caret.top - this.height - 8, 0) : undefined;
    });
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

        const pick = +ev.key;
        if(pick != NaN && pick < this.count) { 
          this.type(this.keys[this.pick = pick]);
        }
      }
      // Prevents default
      return false;
    }
  }
}