import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
import { $animations } from './inkbar.animations';

export interface inkbarPosition {
  left?  : number;
  top?   : number;
  width? : number;
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

  public pos: inkbarPosition = { left: 0, top: 0, width: 0 };
  private elm: ElementRef<HTMLElement>;

  // Triggers the inkbar animation with custom left/width parameters
  get animate() {
    return { 
      value: this.pos, 
      params: {
        left : `${this.pos.left}px`,
        top  : `${this.pos.top}px`,
        width: `${this.pos.width}px`
      }
    };
  }

  @HostListener('window:resize') 
  public update() { this.activate(this.elm); }

  @HostBinding('attr.color')
  @Input() color: ThemePalette = 'accent';

  @Input() height = 2;

  @Output() done = new EventEmitter<inkbarPosition>();

  public clear() { return this.pos = { ...this.pos, width: 0 }; } 

  // Update the inkbarPosition based on the item element
  public activate(elm: ElementRef<HTMLElement>) {

    const el = (this.elm = elm).nativeElement;

    return this.pos = !!el ? { 
      ...this.pos,
      top: el.offsetTop + el.clientHeight, 
      left: el.offsetLeft,
      width: el.clientWidth 
    } : this.pos;
  }
}