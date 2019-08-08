import { wmAlignType, wmText, wmTextStyle, wmLink,  wmInline, wmSizeLevel } from './editable-types';
import { EditableContent } from './editable-content';

/** Implements text nodes */
export class EditableInline extends EditableContent<wmInline> {
  // Overrides with inline specifics
  get value(): string { return this.node.value || ''; }
  set value(text: string) { this.node.value = text; }
  get pad(): string { return ''; }
  get empty(): boolean { return this.length <= 0;}
  // text specifics
  set style(style: wmTextStyle[]) { if(this.type === 'text') { (this.data as wmText).style = [...style]; }}
  get style(): wmTextStyle[] { return (this.type === 'text') ? (this.data as wmText).style || ((this.data as wmText).style = []) : []; } 
  // link specifics
  get url(): string { return (this.data as wmLink).url || ''; }
  // Redirects to the parent container
  set align(align: wmAlignType) { if(!!this.parent) { this.parent.align = align; } }
  get align(): wmAlignType { return !!this.parent ? this.parent.align : 'left'; }
  set level(level: wmSizeLevel) { if(!!this.parent) { this.parent.level = level;} }
  get level(): wmSizeLevel { return !!this.parent ? this.parent.level : 0; }
  
  // Overrides the parent classes with text node specifics
  public set(text: string): this { return (this.value = text), this; }
  
  /** Appends a new text */
  public append(text: string): string { return this.value += text; }
  /** Returns the text content up to the marker */
  public tip(till: number): string { return till === 0 ? '' : (!!till ? this.value.slice(0, till) : this.value); }
  /** Returns the text content from the marker till the end */
  public tail(from: number): string { return from === 0 ? this.value : (!!from ? this.value.slice(from) : ''); }
  /** Inserts a text at the specified position or appends it at the end when the position is undefined */
  public insert(text: string, at?: number): string {
    return ( this.value = this.tip(at) + text + this.tail(at) );
  }
  /** Extracts the text content from/to the specified markers.
   * @param from position starting the extraction from
   * @param to (optional) position ending the extraction to. When not specified, the extraction goes till the end of the text. 
   * @return the extracted text modifying the node text as a consequence. 
   */
  public extract(from: number, to?: number): string {
    const ret = this.value.slice(from, to);
    return this.set( this.tip(from) + this.tail(to) ), ret;
  }
  /** Cuts the text content. This function complements @see extract.
   * @param till position to cut the tip of the text up to
   * @param from (optional) position to cut the tail of the text from
   */
  public cut(till: number, from?: number): string {
    const ret = this.tip(till) + this.tail(from);
    this.value = this.value.slice(till, from);
    return ret;
  }
  /** Returns a touple of indexes representing the word edges within the node value
   * @param index the index position to start seeking the word edges from 
   */
  public edges(index: number): [number, number] {
    
    let before = 0, after = this.length;
    this.value.replace(/\b/g, ( match, offset ) => {

      if(offset <= index && offset > before) { before = offset; }
      if(offset >= index && offset < after) { after = offset; }

      return '';
    });

    return [before, after];
  }

  public format(style: wmTextStyle[]): this {
    // Only text nodes can be formatted
    if(this.type !== 'text') { return this; }

    style.forEach( add => {

      if( this.style.every( style => style !== add )) {
        this.style.push(add);
      }
    });

    return this;
  }

  public unformat(style: wmTextStyle[]): this {
    // Only text nodes can be formatted
    if(this.type !== 'text') { return this; }

    style.forEach( remove => {

      const index = this.style.findIndex( style => style === remove );
      if( index >= 0 ) { 
        this.style.splice(index, 1); 
      }
    });

    return this;
  }
  /** Turns the text node into a link or back*/
  public link(url: string): this {

    // Turns the node into a link (if not already) or back to a plain text
    if(!!url) {

      this.data.type = 'link';
      (this.data as wmLink).url = url;
      delete (this.data as wmText).style;
    }
    else {

      this.data.type = 'text';
      (this.data as wmText).style = [];
      delete (this.data as wmLink).url;
    }
    
    return this;
  }
  /** 
   * Joins the text values of node into this removing the former from the tree.
   * @return this node supoprting chaining.
   */
  public join(node: EditableInline): this {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Join the texts
    this.append(node.value);
    // Remove the empty node
    return node.remove(), this;
  }
  /** Enables merging of text nodes when sharing the same styles */
  public same(node: EditableInline): boolean {
    // Skips testing null or non text nodes (links are never the same)
    if(!node || node.type !== 'text' || this.type !== 'text') { return false; }
    // Short-circuit if style are of different lengths
    if(this.style.length !== node.style.length) { return false; }
    // Compare the two style arrays
    return this.style.every( s1 => node.style.some( s2 => s1 === s2 ) );
  }
  /** 
   * Moves the content from this node foreward into a new editable container of the same type
   * @return the new inserted block first child.
   */
  public break(): this {
    // Skips the operation when not possible
    if(!this.parent) { return null; }
    // Creates a new node as this container next sibling
    const editable = this.parent.insertNext( this.parent.clone(false) );
    // Relocates the content from this node foreward to the new container 
    editable.splice(0, 0, ...this.parent.splice(this.index, -1));
    // Returns the new editable first child
    return editable.firstChild() as this;
  }
  /** 
   * Merges the two nodes. Merging nodes implies that the target node content
   * is appended to the source while all the tree nodes in between are removed 
   * from the tree. Text values are also joined when sharing the same styles.
   * @param node the node to be merged with
   */
  public merge(node: EditableInline): this {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Merges the node branches first
    super.merge(node);
    // If target node is empty, make sure it'll be merged with the proper styles
    if(this.empty) { this.style = [...node.style]; }
    // Compares the node's styles to eventually join them
    if(this.same(node) || node.empty) { this.join(node); }
    // Return this for chaining
    return this;
  }
  /** 
   * Splits a text node into siblings
   * @param from offset where to split the text from
   * @param to (optional) offset where to split the text to
   * @return the first node resulting from the addition
   */
  public split(from: number, to?: number): this {
    // Only text node are splittable
    if(this.type === 'text') { 
      // Saturate till the end if to is not defined
      if(to === undefined) { to = this.length; }
      // When there's something to split at the tip...
      if(from > 0 && from < this.length) {
        // Creates a new text node splitting the text content using clone to preserve the style
        const node = this.clone().set( this.extract(from) );
        //...and inserts it after this node, than recurs to manage the tail
        return (this.insertNext(node) as this).split(0, to - from);
      }
      // When there's something to split at the tail...
      if(to > 0 && to < this.length) {
        // Creates a new text node splitting the text content using clone to preserve the style
        const node = this.clone().set( this.extract(0, to) );
        //...and inserts it before this node
        return this.insertPrevious(node) as this;
      }
    }
    // Returns this node when done 
    return this;
  }
}