import { Pipe, PipeTransform } from '@angular/core';
import { EmojiUtils } from '@wizdm/emoji';

/** Replaces emoji colons short names into their corresponding code-points sequence */
@Pipe({ name: 'emojiNames' })
export class EmojiNamesPipe implements PipeTransform {

  constructor(private utils: EmojiUtils) {}

  transform(value: any): string {

    if(typeof value !== 'string') { return value; }

    return this.utils.replaceShortNames(value);
  }
}
