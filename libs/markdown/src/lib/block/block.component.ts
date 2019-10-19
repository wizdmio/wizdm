import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MarkdownTree } from '../tree/tree.service';
import { mdContent, mdHeading } from '../tree/tree-types';

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
