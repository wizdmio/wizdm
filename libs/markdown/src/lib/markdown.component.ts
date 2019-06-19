import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MarkdownParser, mdAST } from './parser/parser.service';

@Component({
  selector: '[wm-markdown]',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  providers: [ MarkdownParser ]
})
/** Renders a markdown text into an angular view */
export class MarkdownRenderer {
  
  public node: mdAST;

  constructor(private tree: MarkdownParser) {}

  /** Returns the array of parsed footnotes */
  get notes(): mdAST[] { return this.tree.notes || []; }

  @Input('wm-markdown') set parse(source: string|mdAST) {
    // Parses the source md file into an mdAST syntax tree
    this.node = typeof(source) === 'string' ? this.tree.parse(source) : source;
  }

  @Output() navigate = new EventEmitter<string>();

  // Table of content anchor helper
  public toc(heading: mdAST): string {
    // Gets the plain text version of the heading
    return this.tree.text(heading)
      // Removes any non alphanumerical characters (keeps spaces)
      .replace(/[^a-zA-Z0-9 ]/g, '')
      // Replaces spaces with '-'
      .replace(/\s+/g,'-')
      // Lowers the case
      .toLowerCase();
  }

  public pos(node: mdAST): string {
    return '' + (!!node && !!node.position && node.position.start.line);
  }
}
