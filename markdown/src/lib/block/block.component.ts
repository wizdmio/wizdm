import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MarkdownInlineCustomClasses } from '../inline/inline.component';
import { mdContent, mdHeading } from '../tree/tree-types';
import { MarkdownTree } from '../tree/tree.service';

/** Block Elements' custom classes */
export interface MarkdownCustomClasses extends MarkdownInlineCustomClasses {

  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
  h5?: string;
  h6?: string;

  p?: string;

  ol?: string;
  ul?: string;
  li?: string;

  hr?: string;

  blockquote?: string;

  pre?: string;

  table?: string;
  tbody?: string;
  tr?: string;
  td?: string;
}

/** Renders a markdown text into an angular view */
@Component({
  selector: '[wm-block]',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownBlock {
  
  constructor(readonly tree: MarkdownTree) {}

  @Input('wm-block') node: mdContent;

  /** Rendered elements' custom classes */
  @Input() customClasses: MarkdownCustomClasses;

  // AOT safe children from the node
  get children() { return ("children" in this.node) ? this.node.children : [] }

  // Table of content anchor helper
  public toc(heading: mdHeading): string {

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

