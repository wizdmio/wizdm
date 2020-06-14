import { Pipe, PipeTransform } from '@angular/core';
import { emojiNames } from './emoji-names';

/** Replaces emoji colons short names into their corresponding code-points sequence */
@Pipe({ name: 'emojiNames' })
export class EmojiNamesPipe implements PipeTransform {

  transform(value: any): string {

    if(typeof value !== 'string') { return value; }

    return value.replace(/:(100|1234|\w+):/g, (_, name) => {

      return emojiNames[name] || name;
    });
  }
}
