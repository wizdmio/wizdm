import './prism-manual-mode';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { PrismService, PrismLanguages, LANGUAGE_MODULES } from './prism.service';
import { PrismHighlighter } from './highlighter/highlighter.component';
import { PrismTokenizer } from './tokenizer/tokenizer.component';
import { CommonModule } from '@angular/common';

@NgModule({
   declarations: [
    PrismHighlighter,
    PrismTokenizer
  ],
  imports: [ CommonModule ],
  exports: [ PrismHighlighter ],
  providers: [ PrismService ]
})
export class PrismModule { 

  /** Initializes the PrismModule with extra language loaders */
  static init(languages: PrismLanguages): ModuleWithProviders<PrismModule> {

    return {
      ngModule: PrismModule,
      providers: [ { provide: LANGUAGE_MODULES, useValue: languages }]
    }
  }
}