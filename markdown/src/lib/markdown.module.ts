import { NgModule, ModuleWithProviders, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismModule } from '@wizdm/prism';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { EmojiNamesModule } from '@wizdm/emoji/names';
import { MarkdownRoot } from './markdown.component';
import { MarkdownBlock } from './block/block.component';
import { MarkdownInline } from './inline/inline.component';
import { MarkdownConfig, mdConfigToken } from './markdown-config';
import { reparseFactory } from './reparse-factory';

@NgModule({
  imports: [ 
    CommonModule,
    PrismModule,
    EmojiTextModule,
    EmojiNamesModule 
  ],
  declarations: [
    MarkdownRoot,
    MarkdownInline,
    MarkdownBlock
  ],
  exports: [
    MarkdownRoot
  ]
})
export class MarkdownModule { 
  static init(config?: MarkdownConfig): ModuleWithProviders<MarkdownModule> {
    return {
      ngModule: MarkdownModule,
      providers: [
        { provide: mdConfigToken, useValue: config },
        { 
          provide: 'reparse', 
          useFactory: reparseFactory, 
          deps: [ [ new Optional(), new Inject(mdConfigToken) ] ]
        }
      ]
    }
  }
}