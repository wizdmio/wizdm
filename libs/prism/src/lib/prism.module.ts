import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismHighlihter } from './highlighter/highlighter.component';
import { PrismTokenizer } from './tokenizer/tokenizer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PrismHighlihter,
    PrismTokenizer
  ],
  exports: [
    PrismHighlihter,
    PrismTokenizer
  ]
})
export class PrismModule { }