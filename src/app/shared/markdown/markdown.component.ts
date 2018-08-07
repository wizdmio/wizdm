import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RemarkService } from './remark.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type displayType = 'document' | 'footnotes' | 'toc';

@Component({
  selector: 'wm-markdown, [wm-markdown]',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss']
})
/** Renders a markdown text into HTML using angular recursive template injection 
 * Using Remark as the input parser @see {https://github.com/remarkjs/remark}
*/
export class MarkdownComponent implements OnInit, OnDestroy {
  
  private data$: BehaviorSubject<string> = new BehaviorSubject('');
  private sub$: Subscription;
  private notes: string[] = [];
  public  root:  any;

  constructor(private remark: RemarkService) { }

  @Input() display: displayType = "document";
  @Input('data') set parseData(data: string) {

    // Resets notes
    this.notes = [];

    // Pushes the new data in
    this.data$.next(data);
  }
  
  ngOnInit() { 

    // Perform the remark parsing asyncronously debouncing the iput to improve performance 
    this.sub$ = this.data$.pipe( debounceTime(500) )
      .subscribe( data => {
        // Builds the syntax tree or source it from a source component
        this.root = data ? this.remark.parse(data) : {};
        //console.log(`Markdown (display=${this.display}): `, this.root);
      });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
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
    //if(node && node.type !== type) {
    //  console.error(`Expected node of type ${type}`, node);
    //}
  }

  public infoNode(node: any) {
    //console.log('This node type is intentionally not rendered', node);
  }

  public unknownNode(node: any) {
    console.error('Unkown node encounteered', node);
  }
}
