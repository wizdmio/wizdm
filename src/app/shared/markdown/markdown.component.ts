import { Component, OnInit, Input, ContentChild, HostBinding, ElementRef } from '@angular/core';
import { RemarkService } from './remark.service';

export type displayType = 'document' | 'footnotes' | 'toc';

@Component({
  selector: 'wm-markdown, [wm-markdown]',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss']
})
/** Renders a markdown text into HTML using angular recursive template injection 
 * Using Remark as the input parser @see {https://github.com/remarkjs/remark}
*/
export class MarkdownComponent implements OnInit {

  private notes: string[] = [];
  public  root: any;
  
  constructor(private remark: RemarkService) { }

  @Input() display: displayType = "document";
  @Input() data: any;
  
  ngOnInit() {

    // Builds the syntax tree or source it from a source component
    this.root = this.data ? this.remark.parse(this.data) : {};
    console.log(`Markdown (display=${this.display}): `, this.root);
  }

  public tocTabs(depth: number) {
    return '.'.repeat(depth-1);
  }
  
  // Footnote helper function
  public footnote(id: string): number {
    let n = this.notes.findIndex(value => value === id);
    return n < 0 ? this.notes.push(id) : (n + 1);
  }

  // Helper funtions to support template rendering
 
  public someNodes(nodes: any[], type: string) {
    return nodes ? nodes.some( value => value.type === type ): undefined;
  }

  public filterNodes(nodes: any[], type: string) {
    return nodes ? nodes.filter( value => value.type === type ) : undefined;
  }

  public assertNode(node: any, type: string) {
    if(node && node.type !== type) {
      console.error(`Expected node of type ${type}`, node);
    }
  }

  public infoNode(node: any) {
    console.log('This node type is intentionally not rendered', node);
  }

  public unknownNode(node: any) {
    console.error('Unkown node encounteered', node);
  }
}
