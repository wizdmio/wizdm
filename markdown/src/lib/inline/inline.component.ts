import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MarkdownTree } from '../tree/tree.service';
import { mdPhrasingContent } from '../tree/tree-types';
import { MarkdownRoot } from '../markdown.component';

/** Inline Elements' custom classes */
export interface MarkdownInlineCustomClasses {

  em?    : string;
  strong?: string;
  del?   : string;
  code?  : string;
  sub?   : string;
  sup?   : string;
  span?  : string;
  br?    : string;
  a?     : string;
  img?   : string;
}

@Component({
  selector: '[wm-inline]',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownInline { 

  constructor(readonly tree: MarkdownTree, private root: MarkdownRoot) {}

  @Input('wm-inline') node: mdPhrasingContent;

  /** Rendered elements' custom classes */
  @Input() customClasses: MarkdownInlineCustomClasses;

  // AOT safe children from the node
  get children() { return ("children" in this.node) ? this.node.children : [] }

  // Text rendering helper
  public _T(value: string) { return value || ''; }

  // Navigation helper functions
  public navigate(url: string): boolean {
    // Relies on the root parent navigation mechanism 
    this.root.navigate.emit(url);
    // Prevents default navigation towards href
    return false;
  }
}
