
import { EditableContent } from './editable-content';

export class EditableSelection  {

  public start: EditableContent;
  public startOfs: number;
  public end: EditableContent;
  public endOfs: number;
  public content: string;

  private modified = false;

  constructor(private root: EditableContent, private document: Document) {}

  public get single(): boolean {
    return !!this.start && (this.start === this.end);
  }

  public get multi(): boolean { return !this.single; }

  public get whole(): boolean {
    return !!this.start && (this.startOfs === 0) && (this.endOfs === this.end.length);
  }

  public get partial(): boolean { return !this.whole; }

  public get collapsed(): boolean {
    return this.single && (this.startOfs === this.endOfs);
  }

  public mark(modified = true) {
    this.modified = modified;
  }

  private setStart(node: EditableContent, ofs: number) {
    this.start = node;
    this.startOfs = (!!node && ofs < 0) ? node.length : ofs;
    this.modified = true;
  }

  private setEnd(node: EditableContent, ofs: number) {
    this.end = node;
    this.endOfs = (!!node && ofs < 0) ? node.length : ofs;
    this.modified = true;
  }

  public set(start: EditableContent, startOfs: number, end: EditableContent, endOfs: number) {
    this.setStart(start, startOfs);
    this.setEnd(end, endOfs);
  }

  public setCursor(node: EditableContent, ofs: number) {
    return this.set(node, ofs, node, ofs);
  }

  public collapse() {
    this.set(this.start, this.startOfs, this.start, this.startOfs);
  }

  private movePoint(node: EditableContent, offset: number, delta: number): [EditableContent, number] {
    
    offset += delta;

    while(!!node && offset < 0) {
      offset += node.length;
      node = node.previousText();
    }
    
    while(!!node && offset > node.length) {
      offset -= node.length;
      node = node.nextText();
    }

    return [node, offset]; 
  }

  private move(deltaStart: number, deltaEnd?: number) {

    const start = this.movePoint(this.start, this.startOfs, deltaStart);
    const end = !deltaEnd ? start : this.movePoint(this.end, this.endOfs, deltaEnd);
    
    this.start = start[0]; this.startOfs = start[1];
    this.end = end[0]; this.endOfs = end[1];

    if(!!deltaEnd) { this.sort(); }

    this.modified = true;
  }

  private sort() {

    if(!this.start || !this.end) { return; }

    if(this.start.compare(this.end) > 0) {
        
      const node = this.start;
      this.start = this.end;
      this.end = node;

      const ofs = this.startOfs;
      this.startOfs = this.endOfs;
      this.endOfs = ofs;
    }
  }

  private update() {
    !!this.start && this.start.commonAncestor(this.end).update(true);
  }

  // Returns the first range of the current document selection
  private range(): Range {
      
    const sel = !!this.document && this.document.getSelection();
    return !!sel && sel.rangeCount > 0 && sel.getRangeAt(0);
  }

  private domNode(node: EditableContent): Node {

    const span = !!this.document && this.document.getElementById( node && node.id );
    return !!span && span.firstChild;
  }

  /**
   * Queries the document for the current selection
   */
  public query(): EditableSelection {

    try {
      // Query for the selection range
      const range = this.range();

      if(!!range) {
        // Gets the text node parent elements (must be SPAN elements)
        // note: since IE supports parentElement only on Elements, we
        // cast the parentNode instead
        const startElement = range.startContainer.parentNode as HTMLElement;
        const endElement = range.endContainer.parentNode as HTMLElement;
        // Maps the selection start node to the data node
        this.start = this.root.fromElement(startElement);
        this.startOfs = range.startOffset;
        // Maps the selection start node to the data node
        this.end = this.root.fromElement(endElement);
        this.endOfs = range.endOffset;
        // Sorts the node points 
        this.sort();

        this.content = range.startContainer.textContent;
      }
      else {
        // Resets the vales in case the range is undefined or nul
        this.start = this.end = undefined;
        this.startOfs = this.endOfs = 0;
      }
    } catch(e) {}

    // Resets the modified flag
    this.modified = false;
    return this;
  }

  /**
   * Applies the current selection to the document.
   */
  public apply() {

    if(!this.start || !this.modified ) { return; }

    try {
      // Gets the current selection
      const sel = this.document.getSelection();
      // Removes all ranges (aka empty the selection)
      sel.removeAllRanges();
      // Creates a new range
      const range = this.document.createRange();
      // Maps the selection to the relevant dom nodes
      range.setStart(this.domNode(this.start), this.startOfs);
      range.setEnd(this.domNode(this.end), this.endOfs);
      // Apply the new range to the document
      sel.addRange(range);
    }
    catch(e) {}

    // Resets the modified flag
    this.modified = false;
  }

  private updating = null;

  public insert(): boolean {

    if(this.collapsed) {

      clearTimeout(this.updating);

      this.updating = setTimeout((node: EditableContent) => {
        
        this.sync();
        this.query();
        this.mark();
      
      }, 1000, this.start);
      
      return true;
    }
    
    return this.delete();
  }

  private sync() {
    
    if(!!this.start && !!this.updating) {

      clearTimeout(this.updating);
      
      const debug = this.start.sync();

      console.log(debug);

      this.updating = null;
    }
  }
/*
  public insert(text: string): boolean {

    // Deletes the selection, if any
    if(!this.collapsed) { return this.delete(); }
    // Insert the text
    this.start.insert(text, this.startOfs);
    // Shifts the cursor accordingly
    this.move(text.length);
    return false;
  }
*/

  private _delete(): boolean {

    // Multiple node selection
    if(this.multi) {

      if(this.endOfs < this.end.length) {
        this.end.cut(this.endOfs);
        this.setEnd(this.end.previousText(), -1);
        return this._delete();
      }
  
      if(this.startOfs > 0) {
        this.start.cut(0, this.startOfs);
        this.setStart(this.start.nextText(), 0);
        return this._delete();
      }
    }
    // Single node selection
    else {

      this.start.extract(this.startOfs, this.endOfs);
      if(!this.start.empty) {
        this.collapse();
        return false;
      }
    }

    let node = this.end;
    while( node.compare(this.start) >= 0) {
      node.clear().prune();
      node = node.previousText();
    }

    if(!!node) {

      const ofs = node.length;
      node.merge(this.end.nextText());
      this.setCursor(node, ofs);
    }
      
    this.update();
    return false;
  }

  public delete(): boolean {

    this.sync();

    if(this.collapsed) { this.move(0, 1);}

    return this._delete();
  }

  public backspace(): boolean {

    this.sync();

    if(this.collapsed) { this.move(-1, 0); }
    return this._delete();

    if(!this.collapsed) { return this.delete(); }

    // Text merging
    if(this.startOfs > 0) {   
      // Removes the char at cursor position
      this.start.extract(this.startOfs-1, this.startOfs);
      // Shift the cursor one char back
      this.move(-1);
      // In case the first char has been deleted...
      if(this.startOfs === 0) {
        // Prunes the branch when empty 
        this.start.prune(1);
        // Jumps on the previous text node
        const prev = this.start.previousText();
        if(!!prev) {
          // Saves the current cursor offset
          const ofs = prev.length;
          // Merges the siblings when possible
          prev.merge(this.start.nextText());
          // Updates the cursor position
          this.setCursor(prev, ofs);
        }
        // Update the tree forcing the modifications to render
        this.update();
      }

    // Block merging
    } else {

    }
  }

  public enter() {

    this.sync();

    if(!this.collapsed) {
      return this._delete();
    }

    return false;
  }
}
