import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
import { $animations } from './inkbar.animations';

export interface inkbarPosition {
  left?   : number;
  top?    : number;
  width?  : number;
  height? : number;
}

@Component({
  selector: 'wm-inkbar',
  templateUrl: './inkbar.component.html',
  styleUrls: ['./inkbar.component.scss'],
  host: { class: 'wm-inkbar' },
  animations: $animations,
  encapsulation: ViewEncapsulation.None
})
export class InkbarComponent {

  public pos: inkbarPosition = { left: 0, top: 0, width: 0, height: 0 };
  private elm: ElementRef<HTMLElement>;

  // Triggers the inkbar animation with custom left/width parameters
  get animate() {
    return { 
      value: this.pos, 
      params: {
        left : `${this.pos.left}px`,
        top  : `${this.pos.top}px`,
        width: `${this.pos.width}px`,
        height: `${this.pos.height}px`,
      }
    };
  }

  /** Force the inkbar update */
  @HostListener('window:resize') 
  public update() { this.activate(this.elm); }

  /** Inkbar color */
  @HostBinding('attr.color')
  @Input() color: ThemePalette = 'accent';

  /** inkbar thickness */
  @Input() thickness: number = 2;

  /** side to apply the inkbar to */
  @Input() side: 'left'|'top'|'right'|'bottom' = 'bottom';

  /** Emits when the shift is done */
  @Output() done = new EventEmitter<inkbarPosition>();

  /** True when the inkbar slides vertically */
  public get vertical(): boolean {
    return this.side === 'left' || this.side === 'right';
  }

  public clear() { 
    return this.pos = {
      ...this.pos, 
      width: (this.vertical ? this.thickness : 0),
      height: (this.vertical ? 0 : this.thickness) 
    }; 
  } 

  // Update the inkbarPosition based on the item element
  public activate(elm: ElementRef<HTMLElement>) {

    const el = (this.elm = elm).nativeElement;
    if(!el) { return this.pos }

    const top = el.offsetTop + (this.side === 'bottom' ? el.clientHeight : 0);
    const left = el.offsetLeft + (this.side === 'right' ? el.clientWidth : 0);
    const width = this.vertical ? this.thickness : el.clientWidth;
    const height = this.vertical ? el.clientHeight : this.thickness; 

    return this.pos = { ...this.pos, left, top, width, height };
  }
}