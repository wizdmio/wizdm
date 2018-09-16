import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, HostListener } from '@angular/core';
import { MatButton } from '@angular/material';
import { inkbarPosition } from './inkbar/inkbar.component';

export interface filterOption {
  label  : string,
  value? : any
}

@Component({
  selector: 'wm-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements AfterViewInit {

  @ViewChildren(MatButton, { read: ElementRef })
  private buttons: QueryList<ElementRef>;

  constructor() { }

  ngAfterViewInit() {
    // Makes sure to run the drawbar after view inizialization
    setTimeout( () => { this.drawInkbar(this._active); });
  }

  private _options: filterOption[];
  get options(): filterOption[] { return this._options; }

  @Input() set options(opts: filterOption[]) {
    this._options = opts;
    this.active = 0;
  }

  private _active = 0;
  get active(): number { return this._active; }  

  @Input() set active(i: number) {
    
    // Skips when no changes
    if(!!this.options && i != this._active) { 

      // Draws the inkbar
      this.drawInkbar(this._active = i);
      
      // Notifies the new selection
      this.activeChange.emit(i);

      // Notifies the vlaue changed when defined
      if(this.options[i].value) {
        this.valueChange.emit( this.options[i].value );
      }
    }
  }

  @Output() activeChange = new EventEmitter<number>();
  @Output() valueChange = new EventEmitter<any>();

  public inkbar: inkbarPosition = { left: 0, width: 0 };

  private drawInkbar(i: number) {
    try {
      let elements: ElementRef[] = this.buttons.toArray();

      let e: HTMLElement = elements[i].nativeElement;

      this.inkbar = { left: e.offsetLeft, width: e.clientWidth };
    }
    catch(e) {}
  }

  // Makes sure the inkbar follows the element on screen changes
  @HostListener('window:resize') onResize() {
    this.drawInkbar(this._active);
  }
}