import { Directive, ElementRef, Optional, Self, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { EmojiInput } from '@wizdm/emoji/input';

/** Typing In Adapter for texarea and EmojiInput */
@Directive({
  selector: 'textarea[typein], wm-emoji-input[typein]'
})
export class TypeinAdapter {

  constructor(private elref: ElementRef, @Optional() @Self() private emoji: EmojiInput) {}

  /** The host element */
  private get element(): HTMLElement { return this.elref.nativeElement; }

  /** The host element as a textarea */
  private get textarea(): HTMLTextAreaElement { 
    // Assert the element is a texarea
    if(this.element.tagName !== 'TEXTAREA') { throw new Error('This element expected to be a textarea!'); }
    // Return the element as a textarea
    return this.element as HTMLTextAreaElement;
  }

  // Hooks on the input event (textarea only)
  @HostListener('input', ['event$']) onInput(ev: InputEvent) {
    // Redirects the textarea oninput event to the valueChange
    this.valueChange.emit(this.textarea.value); 
  }

  /** Emits for valua changes */
  @Output() valueChange = new EventEmitter<string>();

  /** Types the given text in the textarea/emoji-input at the current cursor position */
  public typein(key: string) {

    // Redirects the input to the EmojiInput.insert()
    if(this.emoji) { this.emoji.insert(key); }
    else {
      // Insert the given text into the textarea
      this.textarea.setRangeText(key, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
      // Force the new value emission since there's no input event triggering
      this.valueChange.emit(this.textarea.value);
    }
  }
}