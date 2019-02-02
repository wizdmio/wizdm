import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EditableText, EditableContent } from '../common/editable-content';
import { wmDocument, wmTextStyle } from '../common/editable-types';

@Injectable({
  providedIn: 'root'
})
/** Virtual document selection mapping browser range selection to the internal document data tree */
export class EditableSelection {

  private root: EditableContent<wmDocument>;
  public start: EditableText;
  public startOfs: number;
  public end: EditableText;
  public endOfs: number;

  private modified = false;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  public attach(document: EditableContent<wmDocument>): EditableSelection {
    return (this.root = document), this;
  }

  public get valid(): boolean { return !!this.start && !!this.end; }

  public get single(): boolean {
    return this.valid && (this.start === this.end);
  }

  public get multi(): boolean { return !this.single; }

  public get whole(): boolean {
    return this.valid && (this.startOfs <= 0) && (this.endOfs >= this.end.length);
  }

  public get partial(): boolean { return !this.whole; }

  public get collapsed(): boolean {
    return this.single && (this.startOfs === this.endOfs);
  }

  public mark(modified = true): EditableSelection {
    this.modified = modified;
    return this;
  }

  private setStart(node: EditableText, ofs: number) {
    this.start = node;
    this.startOfs = (!!node && ofs < 0) ? node.length : ofs;
    this.modified = true;
  }

  private setEnd(node: EditableText, ofs: number) {
    this.end = node;
    this.endOfs = (!!node && ofs < 0) ? node.length : ofs;
    this.modified = true;
  }

  public set(start: EditableText, startOfs: number, end: EditableText, endOfs: number): EditableSelection {
    this.setStart(start, startOfs);
    this.setEnd(end, endOfs);
    return this;
  }

  public setCursor(node: EditableText, ofs: number): EditableSelection {
    return this.set(node, ofs, node, ofs);
  }

  public collapse(): EditableSelection {
    return this.set(this.start, this.startOfs, this.start, this.startOfs);
  }

  private absPoint(node: EditableText, ofs: number): [EditableContent, number] {
    
    if(!node || node.removed) { return [null, 0]; }

    for(let child of node.container.content) { 
      if(child === node) { 
        return [child.container, ofs]; 
      }
      ofs += child.length;
    }

    return [null, 0];
  }

  private relPoint(node: EditableContent, ofs: number): [EditableText, number] {

    if(!node) { return [null, 0]; }
    
    for(let child of node.content) {
      if(ofs <= child.length) { 
        return [child as EditableText, ofs]; 
      }
      ofs -= child.length;
    }
  
    return [null, 0];
  }

  private movePoint(node: EditableText, offset: number, delta: number): [EditableText, number] {

    if(!node) { return [null, offset]; }
    // Shifts the current offset
    offset += delta;
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

  /** Moves the selection start and end points by the specified offsets */
  public move(deltaStart: number, deltaEnd?: number): EditableSelection {
    // Move the selection points
    const start = this.movePoint(this.start, this.startOfs, deltaStart);
    const end = (deltaEnd === undefined) ? start : this.movePoint(this.end, this.endOfs, deltaEnd);
    // Update the selection
    return this.set(start[0], start[1], end[0], end[1]);
  }

  private stack: [EditableContent, number][] = [];

  /** Saves the current seleciton to be restored by calling @see restore() */
  public save(): EditableSelection {
    // Computes the absolute version of the start point
    const start = this.absPoint(this.start, this.startOfs);
    // Saves the current absolute selection in the stack
    this.stack.push( start );
    // Duplicates the start point when collapsed
    if(this.collapsed) { this.stack.push( start ); }
    // Computes the absolute end point otherwise
    else { this.stack.push( this.absPoint(this.end, this.endOfs) ); }
    return this;
  }

  /** Restores the previously saved selection. @see save() */
  public restore(): EditableSelection {
    // Restores the selection from the stack
    if(this.stack.length > 0) {
      // Pops the absolute points
      const absEnd = this.stack.pop();
      const absStart = this.stack.pop();
      // Checks if the selection still falls into existing nodes
      if(absStart[0].removed || absEnd[0].removed) {
        return this.set(null, 0, null, 0);
      }
      // If both abs points matches restores the cursor position
      if(absStart === absEnd) {
        this.setCursor( ...this.relPoint(...absStart) );
      }
      // Restores the relative seleciton otherwise
      else {
        this.setStart(...this.relPoint(...absStart) );
        this.setEnd(...this.relPoint(...absEnd) ); 
      }
    }
    return this;
  }

  public get reversed(): boolean {
    if(!this.valid) { return false; }
    return this.start === this.end && this.startOfs > this.endOfs || this.start.compare(this.end) > 0;
  }

  /** Sort the start/end selection nodes, so, to make sure start comes always first */
  public sort(): EditableSelection {

    // Compares the points' position
    if(this.reversed) {

      const node = this.start;
      this.start = this.end;
      this.end = node;

      const ofs = this.startOfs;
      this.startOfs = this.endOfs;
      this.endOfs = ofs;
    }
    
    return this;
  }

  /** Makes sure the selection falls within the inner nodes when on the edges.  */ 
  public trim(): EditableSelection {
    // Skips on invalid selection
    if(!this.valid) { return this; }
  
    if(this.startOfs === this.start.length) {
      const start = this.start.nextText(true);
      if(!!start) { this.setStart(start, 0);}
    }

    if(this.endOfs === 0) {
      const end = this.end.previousText(true);
      if(!!end) { this.setEnd(end, -1);}
    }

    return this;
  }

  /** Forces the selection to wrap around the closes text word boundaries */
  public wordWrap(): EditableSelection {
    // Skips on invalid selection
    if(!this.valid) { return this; }
    // Seeks for the word edges around the cursor at start node
    const edges = this.edges(this.start.value, this.startOfs);
    // When collapsed, just set the selection at the given edges 
    if(this.collapsed) { return this.set(this.start, edges[0], this.start, edges[1]); }
    // Seeks for the edges at the end node otherwise
    this.startOfs = edges[0];
    this.endOfs = this.edges(this.end.value, this.endOfs)[1];
    return this.mark();
  }

  private edges(value: string, index: number): [number, number] {
    
    let before = 0;
    let after = value.length;
    value.replace(/\b/g, ( match, offset ) => {

      if(offset <= index && offset > before) { before = offset; }
      if(offset >= index && offset < after) { after = offset; }

      return '';
    });

    return [before, after];
  }

  // Returns the first range of the current document selection
  private range(): Range {
      
    const sel = !!this.document && this.document.getSelection();
    return !!sel && sel.rangeCount > 0 && sel.getRangeAt(0);
  }

  /**
   * Queries the document for the current selection
   */
  public query(): EditableSelection {

    try {
      // Query for the selection range
      const range = this.range();
      if(!!range) {
        // Maps the selection start node to the data node
        this.setStart(this.root.fromDom(range.startContainer), range.startOffset);
        // Maps the selection end node to the data node
        this.setEnd(this.root.fromDom(range.endContainer), range.endOffset);
        // Makes sure start node comes always first
        this.sort();
      }
      // Resets the vales in case the range is undefined or null
      else { this.setCursor(undefined, 0); }
  
    } catch(e) {}

    // Resets the modified flag
    return this.mark(false);
  }

  /**
   * Applies the current selection to the document.
   */
  public apply(): EditableSelection {
    // Skips on invalid or unmodified selections
    if(!this.valid || !this.modified) { return this; }

    try {
      // Gets the current selection
      const sel = this.document.getSelection();
      // Removes all ranges (aka empty the selection)
      sel.removeAllRanges();
      // Creates a new range
      const range = this.document.createRange();
      // Maps the selection to the relevant dom nodes
      range.setStart(this.start.domNode, this.startOfs);
      range.setEnd(this.end.domNode, this.endOfs);
      // Apply the new range to the document
      sel.addRange(range);
    }
    catch(e) {}

    // Resets the modified flag
    return this.mark(false);
  }

  /** 
   * Syncs the start node content, so, to reflect the element innerText.
   * This is the recommended way to insert new text into the data tree,
   * so, to ensure taking advantage of all the different OS input features
   * such as OSX 'click and hold'.  
   */
  public sync(): EditableSelection {
    if(this.valid) { this.start.sync();}
    return this;
  }

  public insert(char: string): EditableSelection {

    if(!this.collapsed) { this.delete(); }

    this.start.insert(char, this.startOfs);
    return this.move(1);
  }

  /** Deletes the selection from the document tree */
  public delete(): EditableSelection {
    // Skips on invalid selection
    if(!this.valid) { return; }
    // Whenever the selection applies on a single node...
    if(this.single) {
      // Extracts the selected text within the node 
      this.start.extract(this.startOfs, this.endOfs);
      // If the node is still containing text, we are done...
      if(!this.start.empty) { return this.collapse(); }
    }
    //...otherwise we are dealing with multiple nodes, so...
    else {
      //...just cut the text away each side
      this.start.cut(0, this.startOfs);
      this.end.cut(this.endOfs);
    }
    // Moves the selection just outside the empty nodes, so, for merge to do its magic...  
    if(this.start.empty) { this.start = this.start.previousText() || this.start; }
    if(this.end.empty) { this.end = this.end.nextText() || this.end; }
    // Keeps the current text length...
    const ofs = this.start.length;
    // Merges the nodes
    this.start.merge(this.end);
     // Updates the cursor position
    return this.setCursor(this.start, ofs);
  }
  
  /**
   * Breaks the selection by inserting a new line char or an entire new editable block
   * @param newline when true, a new line charachter wil be used to break the selection,
   * when false a new editable block will be created contening the follwoing text sibling 
   * nodes exlucing this one.
   */
  public break(newline: boolean = false): EditableSelection {
    // Skips on invalid selection
    if(!this.valid) { return this; }
    // Deletes the selection, if any
    if(!this.collapsed) { this.delete(); }
    // Just insert a new line on request forcing it on links
    if(newline || this.start.type === 'link') {
      this.start.insert('\n', this.startOfs);
      return this.move(1);
    }
    // Get the node block type (the root child contaning it)
    const block = this.start.ancestor(1);
    // Matches the relevant editable container to be added depending on the block type 
    const match = { numbered: 'item', bulletted: 'item', table: 'cell' };
    // Splits the node when needed
    this.start.split(this.startOfs);
    // Prepare to insert the new block backward when cursor is at the start edge of a block
    const backward = this.start.first && this.startOfs === 0;
    // Inserts a new editable container right after this node 
    const node = this.start.insertEditable(match[block.type] || 'paragraph', backward);
    // Updates the cursor position when needed
    return backward ? this : this.setCursor(node, 0);
  }

  /** Returns the style of the selection always corresponding to the style of the start node */
  public get style(): wmTextStyle[] {
    return this.valid ? this.start.style : [];
  }

  /** Splits the seleciton at the edges, so, the resulting selection will be including full nodes only */
  public split(): EditableSelection {
    // Skips on invalid selection
    if(!this.valid) { return this; }
    if(this.single) {
      // Splits the single node both sides
      const node = this.start.split(this.startOfs, this.endOfs); 
      this.set(node, 0, node, -1);
    }
    else {
      // Splits the multi selection both ends
      const start = this.start.split(this.startOfs);
      const end = this.end.split(0, this.endOfs);
      this.set(start, 0, end, -1);
    }
    return this;
  }

  /** 
   * Defragments the selections, so, minimizing the number of text nodes comprised in it
   * by joining siblings sharing the same attributes.
   */
  public defrag(): EditableSelection {
    // Skips on invalid selection
    if(!this.valid) { return this; }
    // CLimbs up to the common ancestor
    const root = this.start.common(this.end);
    if(!!root)  {
      // Save the current selection
      this.save();
      // Runs defragmentation down from the common root node
      root.defrag();
      // Restores the selection
      this.restore().trim();
    }
    return this;
  }

  /** 
   * Applies (or removes) a given style set to the selection.
   * @param style style array to be applied.
   * @param remove when true, the requested style will be removed instead.
   */
  public format(style: wmTextStyle[], remove: boolean = false): EditableSelection {
    // Skips on invalid selection
    if(!this.valid) { return this; }
    // Forces wordwrapping when collapsed 
    if(this.collapsed) { this.wordWrap(); }
    // Trims and splits the selection
    this.trim().split();
    // Apply the given style to all the text nodes in the seelction
    let node = this.start;
    while(!!node && node.compare(this.end) <= 0) {

      node = remove ? node.unformat(style) : node.format(style);
      node = node.nextText(true);
    }
    // Defragments the text nodes when done
    return this.defrag();
  }
}