import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MarkdownParser } from '../parser/parser.service';
import { mdPhrasingContent } from '../parser/parser-types';
import { MarkdownRenderer } from '../markdown.component';

@Component({
  selector: '[wm-inline]',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'wm-markdown-inline' }
})
export class InlineComponent {

  constructor(readonly tree: MarkdownParser, private block: MarkdownRenderer) {}

  @Input('wm-inline') node: mdPhrasingContent;

  // Navigation helper functions
  public navigate(node: mdPhrasingContent): boolean {
    // Resolves the node url directly or by reference
    const url = node.type === 'link' && node.url || node.type === 'linkReference' && this.tree.definition(node).url || '';
    // Relies on the block parent event to trigger the navigation by url
    this.block.navigate.emit(url);
    // Prevents the default behaviour avoinding the browser to actually redirect to the [href] address
    // This is crucial to avoid reloading the full app since the renderer fills [href] for both 
    // debugging and clarity purposes
    return false;
  }
}
