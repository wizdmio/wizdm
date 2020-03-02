import { NgModule } from '@angular/core';
import { EmojiMaterial } from './emoji-material.directive';

@NgModule({
  declarations: [ EmojiMaterial ],
  exports: [ EmojiMaterial ]
})
export class EmojiMaterialModule { }