import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarkdownRendererComponent } from './markdown-renderer/markdown-renderer.component';
import { CodeHighlighterComponent } from './code-highlighter/code-highlighter.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    MarkdownRendererComponent,
    CodeHighlighterComponent
  ],
  exports: [
    MarkdownRendererComponent
  ]
})
export class MarkdownModule { }
