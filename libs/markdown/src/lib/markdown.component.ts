import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MarkdownParser } from './parser/parser.service';
import { mdContent, mdHeading, mdFootnoteDefinition } from './parser/parser-types';

@Component({
  selector: '[wm-markdown]',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'wm-markdown' }
})
/** Renders a markdown text into an angular view */
export class MarkdownRenderer {
  
  private node: mdContent;
  get children() { return ("children" in this.node) ? this.node.children : [] }

  constructor(private tree: MarkdownParser) {}

  /** Returns the array of parsed footnotes */
  get notes(): mdFootnoteDefinition[] { return this.tree.notes || []; }

  @Input('wm-markdown') set parse(source: string|mdContent) {
    // Parses the source md file into an mdAST syntax tree
    this.node = typeof(source) === 'string' ? this.tree.parse(source) : source;
  }

  @Output() navigate = new EventEmitter<string>();

  // Table of content anchor helper
  public toc(heading: mdHeading): string {
    // Gets the plain text version of the heading
    return this.tree.text(heading)
      // Removes any non alphanumerical characters (keeps spaces)
      .replace(/[^a-zA-Z0-9 ]/g, '')
      // Replaces spaces with '-'
      .replace(/\s+/g,'-')
      // Lowers the case
      .toLowerCase();
  }

  public pos(node: mdContent): string {
    return '' + (!!node && !!node.position && node.position.start.line);
  }
}
