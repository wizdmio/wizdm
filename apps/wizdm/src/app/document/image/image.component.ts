import { Component, Input, HostBinding } from '@angular/core';
import { EditableImage } from '../model';

@Component({
  selector: '[wm-image]',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  @Input('wm-image') image: EditableImage;
  
  @HostBinding('id') get id() {
    return !!this.image && this.image.id;
  }

  @HostBinding('style.background-image') get url() {
    return !!this.image && !!this.image.data.url ? `url(${this.image.data.url})` : undefined;
  }
}