import { Component, Input, HostBinding } from '@angular/core';
import { EditableContent } from '../common/editable-content';
import { wmImage } from '../common/editable-types';

@Component({
  selector: '[wm-image]',
  template: '',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  @Input('wm-image') image: EditableContent<wmImage>;
  
  @HostBinding('id') get id() {
    return !!this.image && this.image.id;
  }

  @HostBinding('style.background-image') get url() {
    return !!this.image && !!this.image.data.url ? `url(${this.image.data.url})` : undefined;
  }
}