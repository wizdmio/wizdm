import { Directive, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { EmojiUtils } from '@wizdm/emoji/utils';

// 1x1px transparent image placeholder
export const fakeImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

@Directive({
  selector: 'img[wm-emoji]',
  host: { 
    "class": "wm-emoji",
    "style": "box-sizing: border-box; vertical-align: text-bottom;",
    "[style.width]": "size || '1.25em'",
    "[style.height]": "size || '1.25em'",
    "[style.margin-left]": "spacing || '0.05em'",
    "[style.margin-right]": "spacing || '0.05em'",
    "[style.border]": "loading || error ? '1px dashed currentColor' : undefined",
    "[style.opacity]": "loading || error ? '0.25' : undefined"
  }
})
export class EmojiImage {

  public error: boolean; 
  public load: boolean; 
  public emoji: string;
  
  get loading(): boolean { return !this.load; }

  constructor(private utils: EmojiUtils) { }
  
  /** The emoji code to be rendered */
  @Input('wm-emoji') set value(emoji: string) {
    // Tracks the requested emoji sequence
    this.emoji = emoji;
    // Resets the loading flags
    this.load = this.error = false;
  }

  /** Customizes the emoji size when in web mode. Default is 1.25em */
  @Input() size: string;

  /** Customizes the emoji spacing when in web mode. Default is 0.05em (each side) */
  @Input() spacing: string;

  /** Applies the emoji sequence as the alternative */
  @HostBinding('alt') get alt(): string {
    return this.emoji;
  } 

  /** The source file of the emoji image corresponding to the requested code */
  @HostBinding('src') get src(): string {
    // Loads the file falling back to a fake image on error
    return this.error ? fakeImage : this.utils.imageFilePath(this.emoji);
  }

  /** Emits which side (left or right) the emoji image as been hit (mousedowm) */
  @Output() hit = new EventEmitter<'left'|'right'>();

  /** Handles on error event */
  @HostListener('error') onError() { 
    this.error = true; 
  }

  /** Handles on load event */
  @HostListener('load') onLoad() { 
    this.load = true; 
  }

  /** Handles the mouse event to catch for user hits */
  @HostListener('mousedown', ['$event']) onMouseDown({ target, clientX }: MouseEvent) {
    // Computes the Element's client rect
    const rt = (target as HTMLElement).getBoundingClientRect();
    // Checks whatever side of the image the mouse position falls into and emits the event accordingly
    rt && this.hit.emit(clientX < (rt.left + rt.right) / 2 ? 'left' : 'right');
  }
}