import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarkdownRenderer } from './markdown.component';
import { CodeHighlighter } from './highlight/highlight.component';
import { InlineComponent } from './inline/inline.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    MarkdownRenderer,
    CodeHighlighter,
    InlineComponent
  ],
  exports: [
    MarkdownRenderer
  ]
})
export class MarkdownModule { }
