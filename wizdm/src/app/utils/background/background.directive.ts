import { Directive, Input, OnChanges, OnDestroy } from '@angular/core';
import { BackgroundObservable } from './background.service';

/** Background styling directive. Use this directive withing the page to apply the given style to the parent navigator's background */
@Directive({
  selector: 'wm-background'
})
export class BackgroundDirective implements OnChanges, OnDestroy {

  private _image;

  constructor(private background: BackgroundObservable) {}
  
  /** Sets whether a background image's position is fixed within the viewport, or scrolls with its containing block.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment} */
  @Input() attachment: string;

  /** Sets whether an element's background extends underneath its border box, padding box, or content box.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip} */
  @Input() clip: string;

  /** Sets the background color. 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-color} */
  @Input() color: string;

  /** Sets the background's origin: from the border start, inside the border, or inside the padding.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-origin} */
  @Input() origin: string;

  /** Sets the initial position for each background image. The position is relative to the position layer set by origin. 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-position} */
  @Input() position: string;

  /** Sets how background images are repeated. A background image can be repeated along the horizontal and vertical axes, or not repeated at all. 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat} */
  @Input() repeat: string;

  /** Sets the size of the background image. The image can be left to its natural size, stretched, or constrained to fit the available space. 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-size} */
  @Input() size: string;

  /** Sets one or more background images. 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-image} */
  @Input() image: string;

  /** Sets the backgrpund image from an url. */
  @Input() url: string;

  // Applies back the collected properties to the Navigator's background via the service.
  ngOnChanges() {

    // Computes the image as requeste
    const image = this.image || this.url && 'url(' + this.url + ')';

    if(!image) { this._image && this.background.clearBackground(this._image); }
    else {

      this.background.applyBackground({
        "background-image": image,
        "backgroung-clip": this.clip,
        "background-size": this.size,
        "background-color": this.color,
        "background-repeat": this.repeat,
        "background-origin": this.origin,
        "background-position": this.position,
        "background-attachment": this.attachment
      });
    }

    // Keeps track of the active image
    this._image = image;
  }

  // Clears the background when disposed
  ngOnDestroy() { this.background.clearBackground(this._image); }
}
