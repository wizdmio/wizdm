import { NgModule } from '@angular/core';
import { EmojiNamesPipe } from './emoji-names.pipe';

@NgModule({
  declarations: [ EmojiNamesPipe ],
  exports: [ EmojiNamesPipe ]
})
export class EmojiNamesModule { }
