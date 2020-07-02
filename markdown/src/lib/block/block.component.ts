import { Component, Input, ViewEncapsulation } from '@angular/core';
import { mdContent, mdHeading } from '../tree/tree-types';
import { MarkdownTree } from '../tree/tree.service';

@Component({
  selector: '[wm-block]',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  encapsulation: ViewEncapsulation.None
})
/** Renders a markdown text into an angular view */
export class MarkdownBlock {
  
  constructor(readonly tree: MarkdownTree) {}

  @Input('wm-block') node: mdContent;

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

