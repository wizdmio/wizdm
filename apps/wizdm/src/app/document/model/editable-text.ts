import { wmAlignType, wmText, wmTextStyle } from './editable-types';
import { wmBlock, wmList, wmItem } from './editable-types';
import { EditableContent } from './editable-content';

export class EditableBlock extends EditableContent<wmBlock> {}
export class EditableList extends EditableContent<wmList> {}
export class EditableItem extends EditableContent<wmItem> {
  // Overrides the default setter forcing a single node value 
  public set(text: string): this {
    // Wipes text nodes exceeding the fist
    if(this.count > 1) { this.splice(1, -1); }
    // Updates the first node value
    if(this.count > 0) { this.firstChild().value = text };
    // Insert a text node when missing
    if(this.count === 0) { this.appendChild( this.create.text.set(text) ); };
    // Return this for chaining
    return this; 
  }
}

/** Implements text nodes */
export class EditableText extends EditableContent<wmText> {
  // Overrides with text node specifics
  get value(): string { return this.node.value || ''; }
  set value(text: string) { this.node.value = text; }
  set style(style: wmTextStyle[]) { this.data.style = [...style]; }
  get style(): wmTextStyle[] { return this.data.style || (this.data.style = []); } 
  get pad(): string { return ''; }
  get empty(): boolean { return this.length <= 0;}
  // Redirects to the parent container
  set align(align: wmAlignType) { if(!!this.parent) { this.parent.align = align;} }
  get align(): wmAlignType { return !!this.parent ? this.parent.align : 'left'; }
  set level(level: number) { if(!!this.parent) { this.parent.level = level;} }
  get level(): number { return !!this.parent ? this.parent.level : 0; }
  // Overrides the base class with text node specifics
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
    this.data.type = !!url ? 'link' : 'text';
    // Updates the url accordingly
    this.data.url = !!url ? url : undefined;
    // Resets the style
    this.data.style = [];
    return this;
  }
  /** 
   * Joins the text values of node into this removing the former from the tree.
   * @return this node supoprting chaining.
   */
  public join(node: EditableText): this {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Join the texts
    this.append(node.value);
    // Remove the empty node
    return node.remove(), this;
  }
  /** Enables merging of text nodes when sharing the same styles */
  public same(node: EditableText): boolean {
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
  public merge(node: EditableText): this {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Merges the node branches first
    super.merge(node);
    // If target node is empty, make sure it'll be merged with the proper styles
    if(this.empty) { this.data.style = [...node.style]; }
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