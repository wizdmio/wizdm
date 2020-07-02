import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismHighlighter } from './highlighter/highlighter.component';
import { PrismTokenizer } from './tokenizer/tokenizer.component';
import './prism-manual-mode';
import * as ManualModePrism from 'prismjs';

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
  providers: [{ provide: 'prism', useValue: ManualModePrism }]
})
export class PrismModule { }