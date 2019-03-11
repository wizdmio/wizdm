import { Component, Input, HostBinding } from '@angular/core';
import { EditableSelection } from '../selection/editable-selection.service';
import { EditableImage } from '../model';

@Component({
  selector: '[wm-image]',
  template: '&#8203;',
  //templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  constructor(private sel: EditableSelection) {}

  @Input('wm-image') image: EditableImage;
  
  @HostBinding('id') get id() {
    return !!this.image && this.image.id;
  }

  @HostBinding('attr.selected') get outline() {
    return !!this.image && this.image === this.sel.pick('image') ? '' : undefined; 
  }

  @HostBinding('style.background-image') get url() {
    return !!this.image && !!this.image.data.url ? `url(${this.image.data.url})` : undefined;
  }
}