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

  // Text rendering helper
  public _T(value: string) { return value || ''; }

  // Navigation helper functions
  public navigate(url: string): boolean {
    // Relies on the block parent navigation mechanism 
    this.block.navigate.emit(url);
    // Prevents default navigation towards href
    return false;
  }
}
