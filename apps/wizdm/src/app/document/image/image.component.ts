import { Component, Input, HostBinding } from '@angular/core';
import { EditableImage } from '../model';
import { EditableSelection } from '../selection/editable-selection.service';

@Component({
  selector: '[wm-image]',
  template: '&#8203;',
  //templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  constructor(private sel: EditableSelection) {}

  @Input('wm-image') image: EditableImage;
  // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.image && this.image.id; }
  // Applies image margins according to node alignement
  @HostBinding('style.margin-left') get mleft() { 
    return !!this.image && !!this.image.align && this.image.align !== 'left' ? 'auto' : null; 
  }
  @HostBinding('style.margin-right') get mright() { 
    return !!this.image && !!this.image.align && this.image.align !== 'right' ? 'auto' : null; 
  }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { return this.sel.selected(this.image) ? '' : undefined; }
  // Loads the requested url image as element background 
  @HostBinding('style.background-image') get url() {
    return !!this.image && !!this.image.data.url ? `url(${this.image.data.url})` : undefined;
  }
}