import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismHighlighter } from './highlighter/highlighter.component';
import { PrismTokenizer } from './tokenizer/tokenizer.component';
import { prism } from './prism-module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PrismHighlighter,
    PrismTokenizer
  ],
  exports: [
    PrismHighlighter,
    PrismTokenizer
  ],
  providers: [ { provide: 'prism', useFactory: () => prism }]
})
export class PrismModule { }