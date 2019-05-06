import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as reparse from './reparse/reparse.module';

@Component({
  selector: '[wm-markdown]',
  templateUrl: './markdown.component.html',
  //styleUrls: ['./markdown.component.scss']
  styles: [] 
})
/** Renders a markdown text into HTML using angular recursive template injection 
 * Using Remark as the input parser @see {https://github.com/remarkjs/remark}
*/
export class MarkdownRenderer implements OnInit, OnDestroy {
  
  private data$: BehaviorSubject<string> = new BehaviorSubject('');
  private sub$: Subscription;
  private notes: string[] = [];
  public  root: any;

  constructor() { }

  @Input() delay: 500;
  @Input('wm-markdown') set parseData(data: string) {

    // Resets notes
    this.notes = [];

    // Pushes the new data in
    this.data$.next(data);
  }

  @Output() rendered = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();
  
  ngOnInit() { 

    // Perform the remark parsing asyncronously debouncing the iput to improve performance 
    this.sub$ = this.data$.pipe( debounceTime( this.delay ) )
      .subscribe( data => {
        // Builds the syntax tree or source it from a source component
        this.root = data ? this.parse(data) : {};
        //console.log(`Markdown (display=${this.display}): `, this.root);

        // Notifies the completion of data parsing the next scheduler round
        // when supposidely the view has been rendered already
        setTimeout( () => this.rendered.emit() );
      });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  private parse(data: string): any {
    return reparse.parse(data);
  }

  private parseText(children: any[]): string {

    if(!children || children.length <= 0) { return ''; }

    const text = children.reduce( (txt: string, child: any) => {

      txt += child.type === 'text' ? child.value : '';
      txt += this.parseText(child.children);
      return txt;

    }, '');

    return text;
  }

  private sanitizeText(text: string): string {
    return text
      // Removes any non alphanumerical characters (keeps spaces)
      .replace(/[^a-zA-Z0-9 ]/g, '')
      // Replaces spaces with '-'
      .replace(/\s+/g,'-')
      // Lowers the case
      .toLowerCase();
  }

  // Top level node position helper
  public position(node: any): string {
    return <string>(node.position && node.position.start && node.position.start.line);
  }

  // Table of content anchor helper
  public toc(heading: any): string {
    // Parses the heading text
    let anchor = this.parseText(heading.children);
    // Converts the text into a suitable format
    anchor = this.sanitizeText(anchor);
    // Returns the anchor value
    return anchor;
  }

  // Definitions helper function
  public definition(id: string): string {
    // Gets the top level children array
    const elements: any[] = this.root ? this.root.children : [];
    // Lookup for the requested definition across the tree (top level only)
    const found = elements.find( el => el.type === 'definition' && el.identifier === id );
    // return the resolve url
    return found ? found.url : null;
  }

  // Footnote helper function
  public footnote(id: string): number {
    // Check if the footnotes was already defined
    const n = this.notes.findIndex(value => value === id);
    // Returns the footnote's index 
    return n < 0 ? this.notes.push(id) : (n + 1);
  }

  // Navigation helper functions
  public navigateUrl(ev: Event, url: string) {
    // Prevent the default browser behavior. This is crucial to avoid reloading the full app 
    // since the renderer fills [href] for both debugging and clarity purposes
    ev.preventDefault();
    // Emits the navigation event for the parent to handle it
    this.navigate.emit(url);
  }

  public navigateDef(ev: Event, id: string) {
    const url = this.definition(id);
    this.navigateUrl(ev, url);
  }

  public navigateToc(ev: Event, anchor: string) {
    this.navigateUrl(ev, `#${anchor}`);
  }

  // Link helper functions
  public parseLink(link: string) {
    // Resturns the very first part of a link string
    return link.split('?')[0];
  }

  public parseLinkParams(link: string) {

    // Check for parameters ( ex: ../jump-here?mode=set&value=max )
    const parts = link.split('?');
    if(parts.length <= 1) { return null; }

    // Match for parameter pattern
    const re = /(\w+)=(\w*)\&*/g;
    let params = {};

    // Build the parameter object
    parts[1].replace(re, (match: string, param: string, value: string) => {
      params[param] = value;
      return '';
    });

    return params;
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
