import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RemarkService } from '../remark-wrapper/remark.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type displayType = 'document' | 'toc' | 'footnotes';

@Component({
  selector: 'wm-markdown, [wm-markdown]',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
  host: {
    '[class.wm-markdown-theme]': 'true'
  }
})
/** Renders a markdown text into HTML using angular recursive template injection 
 * Using Remark as the input parser @see {https://github.com/remarkjs/remark}
*/
export class MarkdownRendererComponent implements OnInit, OnDestroy {
  
  private data$: BehaviorSubject<string> = new BehaviorSubject('');
  private sub$: Subscription;
  private notes: string[] = [];
  public  root:  any;

  constructor(private remark: RemarkService) { }

  @Input() display: displayType = "document";
  @Input() delay: 500;
  @Input('data') set parseData(data: string) {

    // Resets notes
    this.notes = [];

    // Pushes the new data in
    this.data$.next(data);
  }

  @Output() rendered = new EventEmitter<void>();
  
  ngOnInit() { 

    // Perform the remark parsing asyncronously debouncing the iput to improve performance 
    this.sub$ = this.data$.pipe( debounceTime( this.delay ) )
      .subscribe( data => {
        // Builds the syntax tree or source it from a source component
        this.root = data ? this.remark.parse(data) : {};
        //console.log(`Markdown (display=${this.display}): `, this.root);

        // Notifies the completion of data parsing the next scheduler round
        // when supposidely the view has been rendered already
        setTimeout( () => this.rendered.emit() );
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
/*
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
  }*/
}
