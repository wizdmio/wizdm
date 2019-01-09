import { Inject, Component, OnInit, OnDestroy, Input, AfterViewChecked, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { wmEditable, wmDocument, EditableContent } from './editable/editable-content';
//import { DocumentService } from './document.service';

@Component({
  selector: 'wm-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent extends EditableContent implements AfterViewChecked {

  constructor(@Inject(DOCUMENT) private document: Document) { super(); }

  @Input() source: wmDocument;

  @Input() edit = true;

  // Document selection
  private selection = new DocumentSelection(this.document);

  private content: wmEditable;

  private queryContent() {

    // QUeries for the current document selection
    this.selection.query();

    // Walks throughout the node tree till the selected content
    this.content = this.walkTree(this.source,this.selection.fromName);
  }

  ngAfterViewChecked() {

    // Applies the current selection to the document when needed. This is essential even when the selection
    // isn't modified since the document selection gets resetted when the involved node(s) are modified 
    // (like view rendering after content update)
    this.selection.apply();
  }
/*
  @HostListener('document:selectionchange', ['$event']) selChange() {

    const sel = this.selection.query();

    console.log(sel);

  }
/*
  @HostListener('keyup', ['$event']) syncContent() {

    // Query the current document selection (aka cursor position when collapsed)
    const sel = this.selection.query();
    if(sel.collapsed) {

      // Walk the document tree till the selected node
      const docNode = this.walkTree(this.source,this.selection.fromName);

      // Update the node content triggering change detection for re-rendering the element
      docNode.value = sel.text.replace('\u200B', '');

      // Mark for selection restoring after the rendering
      this.restore = true;
    }
  }
*/
  @HostListener('keydown', ['$event']) keyPressed(ev: KeyboardEvent) {

    // Fallback to default while not in edit mode
    if(!this.edit) { return true; }

    // Query for the selected content
    this.queryContent();
    
    switch(ev.key) {
    
      // Navigation
      case 'ArrowDown' : return this.keyDown(ev);
      case 'ArrowLeft' : return this.keyLeft(ev);
      case 'ArrowRight': return this.keyRight(ev);
      case 'ArrowUp'   : return this.keyUp(ev);
      case 'Tab'       : return this.keyTab(ev);
      
      // Merging
      case 'Delete'    : return this.keyDelete(ev);
      case 'Backspace' : return this.keyBack(ev);

      // Splitting
      case 'Enter'     : return this.keyEnter(ev); 
    }

    // Editing
    return ev.key.length === 1 ? this.keyChar(ev.key) : true;
  }

  private keyChar(ch: string) {

    if(this.selection.collapsed) {

      // Splits the current node value
      const tip = this.content.value.slice(0, this.selection.fromOfs);
      const tail = this.content.value.slice(this.selection.fromOfs);

      // Update the node value triggering change detection for re-rendering the element
      this.content.value = tip + ch + tail;

      // Shift the cursor one char ahead
      this.selection.move(1);
    }

    return false;
  }

  private keyBack(ev: KeyboardEvent) { 

    if(this.selection.collapsed) {

      if(this.selection.fromOfs > 0) {

        // Removes the char at cursor position
        const tip = this.content.value.slice(0, this.selection.fromOfs - 1);
        const tail = this.content.value.slice(this.selection.fromOfs);
        
        // Update the node value: this will trigger the element rendering
        this.content.value = tip + tail;

        // Shift the cursor one char back
        this.selection.move(-1);
      }
      else {

        // Marks the tree branch up to be removed when empty
        this.pruneBranch(this.content);

        // Jumps to the previous text
        this.content = this.prevText(this.content);
        if(!!this.content) {

          // Updates the selection accordingly
          const ofs = this.content.value.length;
          this.selection.set(this.content.name, ofs, this.content.name, ofs);

          // Recurs
          return this.keyBack(ev);
        }
      }
    }

    return false;
  }

  private keyEnter(ev: KeyboardEvent) {

    return this.keyChar('\n');

    if(this.selection.collapsed) {

      // Insert a break splitting the text node when necessary, returning the name of the 
      // last inserted node (right after the break)
      const name = this.insertBreak(this.source, this.selection.fromName, this.selection.fromOfs);

      // Updates the selection, so, the cursor will be placed at the beginning of the last 
      // inserted text node
      this.selection.set(name, 0, name, 0);
    }

    // Prevents default behavior
    return false;
  }

  private keyDown(ev) { }
  private keyLeft(ev) { }
  private keyRight(ev) { }
  private keyUp(ev) { }
  private keyTab(ev) { }
  private keyDelete(ev) { }
  
}

export class DocumentSelection extends EditableContent {

  public fromName: string;
  public fromOfs: number;
  public toName: string;
  public toOfs: number;

  private modified = false;

  constructor(private document: Document) { super();}

  public mark(modified = true) {
    this.modified = modified;
  }

  public set(fromName: string, fromOfs: number, toName: string, toOfs: number) {
    this.fromName = fromName;
    this.fromOfs = fromOfs;
    this.toName = toName;
    this.toOfs = toOfs;
    this.modified = true;
  }

  public move(dFrom: number, dTo?: number) {
    this.fromOfs += dFrom;
    this.toOfs += dTo || dFrom;
    this.modified = true;
  }
  
  public get collapsed(): boolean {
    return this.fromName === this.toName && this.fromOfs === this.toOfs;
  }
/*
  public get all(): boolean {
    return this.fromName === this.toName && 
      this.fromOfs === 0 &&
      this.toOfs === this.text.length-1;
  }
*/

  // Returns the first range of the current document selection
  private get range(): Range {
      
    const sel = !!this.document && this.document.getSelection();
    return sel && sel.rangeCount > 0 && sel.getRangeAt(0);
  }

  /**
   * Queries the document for the current selection
   */
  public query(): DocumentSelection {

    // Query for the selection range
    const range = this.range;

    // Resets the modified flag
    this.modified = false;
    
    if(!!range) {

      // Maps the selection start node to the data node
      this.fromName = this.fromElement(range.startContainer.parentElement);
      this.fromOfs = range.startOffset;

      // Maps the selection end node to the data node
      this.toName = this.fromElement(range.endContainer.parentElement);
      this.toOfs = range.endOffset;
    }
    else {

      // Resets the vales in case the range is undefined or nul
      this.fromName = this.toName = '';
      this.fromOfs = this.toOfs = 0;
    }

    return this;
  }

  /**
   * Applies the current selection to the document.
   */
  public apply() {

    if(!this.fromName || !this.modified ) { return; }

    // Resets the modified flag
    this.modified = false;

    try {

      // Gets the current selection
      const sel = this.document.getSelection();

      // Removes all ranges (aka empty the selection)
      sel.removeAllRanges();

      // Creates a new range
      const range = this.document.createRange();

      // Gets the start node (it has to be the first child of the span element)
      const span = this.document.getElementById( this.elementId(this.fromName) );
      const start = span.firstChild;

      range.setStart(start, this.fromOfs);

      if(this.collapsed) {
        range.setEnd(start, this.fromOfs);
      }
      else {

        // Gets the end node
        const span = this.document.getElementById( this.elementId(this.toName) );
        const end = span.firstChild;

        range.setEnd(end, this.toOfs);
      }

      // Apply the new range to the document
      sel.addRange(range);
    }
    catch(e) {}
  }
}