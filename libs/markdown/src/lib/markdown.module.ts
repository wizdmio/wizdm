import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownRoot } from './markdown.component';
import { MarkdownBlock } from './block/block.component';
import { MarkdownInline } from './inline/inline.component';
import { CodeHighlighter } from './highlight/highlight.component';

@NgModule({
  imports: [ 
    CommonModule
  ],
  declarations: [
    MarkdownRoot,
    MarkdownInline,
    MarkdownBlock,
    CodeHighlighter,
  ],
  exports: [
    MarkdownRoot
  ]
})
export class MarkdownModule { }