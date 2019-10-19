import { Component, Optional, Inject, forwardRef, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MarkdownTree } from './tree/tree.service';
import { MarkdownBlock } from './block/block.component';
import { mdContent, mdHeading, mdFootnoteDefinition } from './tree/tree-types';

@Component({
  selector: '[wm-markdown]',
  templateUrl: './block/block.component.html',
  styleUrls: ['./block/block.component.scss'],
  providers: [ MarkdownTree ],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'wm-markdown' }
})
/** Renders a markdown text into an angular view */
export class MarkdownRoot extends MarkdownBlock {
  
  constructor(tree: MarkdownTree) { super(tree); }

  /** Returns the array of parsed footnotes */
  public get notes(): mdFootnoteDefinition[] { return this.tree.notes || []; }

  @Input('wm-markdown') set parse(source: string|mdContent) {
    // Parses the source md file into an mdAST syntax tree
    this.node = typeof source === 'string' ? this.tree.parse(source) : source;
  }

  /** Navigation event emitted when a link is clicked on */
  @Output('navigate') navigate = new EventEmitter<string>();
}
