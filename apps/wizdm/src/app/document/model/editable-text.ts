import { wmEditableTypes, wmEditable, wmNodeType, wmIndentType, wmAlignType, wmText, wmTextStyle } from './editable-types';
import { wmDocument, wmBlock, wmList, wmItem, wmTable, wmRow, wmCell } from './editable-types';
import { EditableContent } from './editable-content';

export class EditableBlock extends EditableContent<wmBlock> {}
export class EditableList extends EditableContent<wmList> {}
export class EditableItem extends EditableContent<wmItem> {}

/** Implements text nodes */
export class EditableText extends EditableContent<wmText> {

  get value(): string { return this.node.value || ''; }
  set value(text: string) { this.node.value = text; }
  //get length() { return this.value.length; }
  get empty(): boolean { return this.length <= 0;}
  /** Sets/gets the container's alignement */
  set align(align: wmAlignType) { if(!!this.parent) { this.parent.align = align;} }
  get align(): wmAlignType { return !!this.parent ? this.parent.align : 'left'; }
  /** Sets/gets the container's level */
  set level(level: number) { if(!!this.parent) { this.parent.level = level;} }
  get level(): number { return !!this.parent ? this.parent.level : 0; }
  /** Sets/gets the node style set */
  set style(style: wmTextStyle[]) { this.data.style = [...style]; }
  get style(): wmTextStyle[] { return this.data.style || (this.data.style = []); } 

  /** Compares whenever two nodes share the same type and format */
  public same(node: EditableText): boolean {
    // Skips testing null or non text nodes (links are never the same)
    if(!node || node.type !== 'text' || this.type !== 'text') { return false; }
    // Short-circuit if style are of different lengths
    if(this.style.length !== node.style.length) { return false; }
    // Compare the two style arrays
    return this.style.every( s1 => node.style.some( s2 => s1 === s2 ) );
  }

  /** 
   * Joins the text values of node into this removing the former from the tree.
   * @return this node supoprting chaining.
   */
  public join(node: EditableText): EditableText {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Join the texts
    this.append(node.value);
    // Remove the empty node
    return node.remove(), this;
  }

  /** Appends a new text */
  public append(text: string): string {
    return this.value += text;
  }

  /** Returns the text content up to the marker */
  public tip(till: number): string {
    if(till === 0) { return ''; }
    return !!till ? this.value.slice(0, till) : this.value;
  }

  /** Returns the text content from the marker till the end */
  public tail(from: number): string {
    if(from === 0) { return this.value; }
    return !!from ? this.value.slice(from) : '';
  }

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
    this.value = this.tip(from) + this.tail(to);
    return ret;
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

  /** 
   * Jumps to the previous editable text node.
   * @param traverse (default = false) when true the previous node will be returned
   * traversing the full tree. It'll stop on the same parent's sibling otherwise 
   */
  public previousText(traverse: boolean = false): EditableText {

    const node = this.previous(traverse);
    if(!node) { return null; }
    if(node.type === 'text' || node.type === 'link') { return node as EditableText; }
    return (node as EditableText).previousText(traverse);
  }

  /** 
   * Jumps to the next editable text node.
   * @param traverse (default = false) when true the next node will be returned
   * traversing the full tree. It'll stop on the same parent's sibling otherwise. 
   */
  public nextText(traverse: boolean = false): EditableText {

    const node = this.next(traverse);
    if(!node) { return null; }
    if(node.type === 'text' || node.type === 'link') { return node as EditableText; }
    return (node as EditableText).nextText(traverse);
  }

   public move(offset: number): [EditableText, number] {
    // Gets a reference to this nodes
    let node: EditableText = this as any;
    // Jumps on previous nodes whenever the new offset crossed 0
    while(offset < 0) {
      // Jumps on the previous node traversing the full tree
      const prev = node.previousText(true);
      // If null, we are done
      if(!prev) { offset = 0; break; }
      // When crossing text containers, account for the new line
      if(!prev.siblings(node)) { offset++; }
      // Adjust the offset according to node length
      offset += prev.length;
      // Loop on the next node
      node = prev;
    }
    // Jumps on next nodes whenever the new offset cossed the  node length
    while(offset > node.length) {
      // Jumps on the next node traversing the full tree
      const next = node.nextText(true);
      // If null, we are done
      if(!next) { offset = node.length; break; }
      // When crossing text containers, account for the new line
      if(!next.siblings(node)) { offset--; }
      // Adjust the offset according to node length
      offset -= node.length;
      // Loop on the next node
      node = next;
    }
    // Return the new node/offset pair
    return [node, offset]; 
  }

  /**
   * Creates a new node of the specified type
   * @param type the type of node to be created
   * @return the new node
   */
  public createText(text: string, style?: wmTextStyle[]): EditableText {

    return this.factory.create({ 
      type: 'text',
      value: text,
      style: !!style ? [...style] : []
    } as wmText);
  }

  public createTextPrev(text: string, style?: wmTextStyle[]): EditableText {
    return this.insertPrevious(this.createText(text, style)) as EditableText;
  }

  public createTextNext(text: string, style?: wmTextStyle[]): EditableText {
    return this.insertNext(this.createText(text, style)) as EditableText;
  }

  public format(style: wmTextStyle[]): EditableText {
    // Only text nodes can be formatted
    if(this.type !== 'text') { return this; }

    style.forEach( add => {

      if( this.style.every( style => style !== add )) {
        this.style.push(add);
      }
    });

    return this;
  }

  public unformat(style: wmTextStyle[]): EditableText {
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

  /** 
   * Merges the two nodes. Merging nodes immplies that the target node content
   * is appended to the source while all the tree nodes in between are removed 
   * from the tree. Text values are also joined when sharing the same styles.
   * @param node the node to be merged with
  */
  public merge(node: EditableText): EditableText {
    // Skips when null or unnecessary
    if(!node || node === this) { return this; }
    // Prunes the branches between the nodes, so, this and node are now siblings
    this.prune(node);
    // Whenever the nodes are not sharing the parent already...
    if(!this.siblings(node) || !this.parent || !node.parent) {
      // Removes the node parent from the tree (since is supposedly going to be empty)
      node.parent.remove();
      // Append the content of node to this
      this.parent.splice(this.parent.count, 0, ...node.parent.content);
    }
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
  public split(from: number, to?: number): EditableText {
    // Only text node are splittable
    if(this.type === 'text') { 
      // Saturate till the end if to is not defined
      if(to === undefined) { to = this.length; }
      // When there's something to split at the tip...
      if(from > 0 && from < this.length) {
        // Creates a new text node splitting the text content
        const node = this.createText( this.extract(from), this.style );
        //...and inserts it after this node, than recurs to manage the tail
        return (this.insertNext(node) as EditableText).split(0, to - from);
      }
      // When there's something to split at the tail...
      if(to > 0 && to < this.length) {
        // Creates a new text node splitting the text content 
        const node = this.createText( this.extract(0, to), this.style );
        //...and inserts it before this node
        return this.insertPrevious(node) as EditableText;
      }
    }
    // Returns this node when done 
    return this;
  }

  /** Turns a text into a link node and back */
  public link(url: string): EditableText {
    // Turns the node into a link (if not already) or back to a plain text
    this.data.type = !!url ? 'link' : 'text';
    // Updates the url accordingly
    this.data.url = !!url ? url : undefined;
    // Resets the style
    this.data.style = [];
    return this;
  }

  /** 
   * Moves the content from this node foreward into a new editable container of the same type
   * @return the new inserted block first child.
   */
  public break(): EditableText {
    // Skips the operation when not possible
    if(!this.parent) { return null; }
    // Creates a new node as this container next sibling
    const editable = this.parent.createNext({ type: this.parent.type } as wmEditableTypes);
    // Relocates the content from this node foreward to the new container 
    editable.splice(0, 0, ...this.parent.splice(this.index, -1));
    // Returns the new editable first child
    return editable.firstChild() as EditableText;
  }
}