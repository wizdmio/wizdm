import { Component, Input, HostBinding } from '@angular/core';
import { wmImage, EditableContent } from '../common/editable-content';

@Component({
  selector: 'wm-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  @HostBinding('style.background-image') get url() {
    return !!this.image && !!this.image.data.url ? `url(${this.image.data.url})` : undefined;
  }

  constructor() { }

  @Input('wm-image') image: EditableContent<wmImage>;

  @HostBinding('id') get id() {
    return this.image.id;
  }
}