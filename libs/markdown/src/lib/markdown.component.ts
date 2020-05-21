import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { mdContent, mdFootnoteDefinition } from './tree/tree-types';
import { MarkdownBlock } from './block/block.component';
import { MarkdownTree } from './tree/tree.service';
import { EmojiMode } from '@wizdm/emoji/utils';

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
  
  constructor(readonly tree: MarkdownTree) { super(tree); }

  /** Returns the array of parsed footnotes */
  public get notes(): mdFootnoteDefinition[] { return this.tree.notes || []; }

  @Input('wm-markdown') set parse(source: string|mdContent) {
    // Makes sure source is a valid entry
    if(!source) { source = ''; }
    // Parses the source md file into an mdAST syntax tree
    this.node = typeof source === 'string' ? this.tree.parse(source) : source;
  }

  /** Disables code highlighting */
  @Input('disableHighlighting') set disablePrism(value: boolean) { 
    this.tree.disableHighlighting = coerceBooleanProperty(value); 
  }
  
  /** Emoji Rendering Mode */
  @Input() set emojiMode(mode: EmojiMode) {
    this.tree.emojiMode = mode;
  }


  /** Navigation event emitted when a link is clicked on */
  @Output('navigate') navigate = new EventEmitter<string>();
}
