import { Directive, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { EmojiUtils } from '../utils';

@Directive({
  selector: 'img[wm-emoji]',
  host: { "style": "width: 1.25em; height: 1.25em; vertical-align: text-bottom; margin: 0 0.05em; box-sizing: border-box;" }
})
export class EmojiImage { 

  constructor(private utils: EmojiUtils) { }

  /** The source file of the emoji image corresponding to the requested code */
  @HostBinding('attr.src') get src(): string {
    return this.utils.imageFilePath(this.emoji);
  }

  //@HostBinding('attr.alt')
  /** The emoji code to be rendered */
  @Input('wm-emoji') emoji: string; 

  /** Emits which side (left or right) the emoji image as been hit (mousedowm) */
  @Output() hit = new EventEmitter<'left'|'right'>();

  /** Handles the mouse event to catch for user hits */
  @HostListener('mousedown', ['$event']) onMouseDown({ target, clientX }: MouseEvent) {
    // Computes the Element's client rect
    const rt = (target as HTMLElement).getBoundingClientRect();
    // Checks whatever side of the image the mouse position falls into and emits the event accordingly
    rt && this.hit.emit(clientX < (rt.left + rt.right) / 2 ? 'left' : 'right');
  }
}