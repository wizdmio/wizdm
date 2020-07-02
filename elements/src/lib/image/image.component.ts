import { Component, Input, ViewEncapsulation } from '@angular/core';

/** Simple img wrapper component for easy loading/error handling */
@Component({
  selector: 'wm-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'wm-image' }
})
export class ImageComponent  {

  public load: boolean;
  public error: boolean;
  public source: string;

  /** The source url */
  @Input() set src(src: string) {
    this.load = this.error = false;
    this.source = src;
  }

  /** The alt input */
  @Input() alt: string;
}
