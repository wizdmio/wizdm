import { Component, Input, HostBinding } from '@angular/core';
import { wmImage, EditableContent } from '../editable/editable-content';

@Component({
  selector: 'wm-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent extends EditableContent {

  //constructor() { super(); }

  @HostBinding('style.background-image') get url() {
    return !!this.img && !!this.img.url ? `url(${this.img.url})` : undefined;
  }

  @Input('wm-image') img: wmImage;
}