import { Component, Inject, AfterViewChecked, Input, HostBinding, HostListener, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { wmDocument, wmSizeLevel } from './model/editable-types';
import { EditableDocument } from './model/editable-document';
import { EditableInline } from './model/editable-inline';
import { EditableContent } from './model/editable-content';
import { EditableSelection } from './model/editable-selection';
import { EditableFactoryService } from './factory/editable-factory.service';

@Component({
  selector: 'wm-editable-document',
  templateUrl: './editable-document.component.html',
  styleUrls: [ './editable-document.component.scss' ],
  host: { 'class': 'wm-editable-document' },
  encapsulation: ViewEncapsulation.None
})
export class DocumentComponent extends EditableDocument implements AfterViewChecked {

  readonly selection = new EditableSelection(this);
  public caret: ClientRect;

  @HostBinding('attr.contenteditable') get editable() { 
    return this.editMode ? 'true' : 'false';
  }

  private get window(): Window { return this.document.defaultView; }

  constructor(@Inject(DOCUMENT) private document: Document, factory: EditableFactoryService) { 
    super(factory, null); 
    // Makes sure a minimal document always exists
    this.new();
  }

  /** Document source */
  private source: wmDocument;
  @Input('source') set _source(source: wmDocument) {

    // Keeps track of the source
    this.source = source;
    // Skips loading during editing
    if(this.edit) { return; }
    // Loads the source data building the tree otherwise
    this.load(source).defrag();

    //console.log(this.value);
  }

  private editMode = false;

  /** When true switches to edit mode */
  get edit(): boolean { return this.editMode; }
  @Input() set edit(mode: boolean) { 
    // Entering edit mode queries for the current selection and initiaizes the history buffer
    if(this.editMode = mode) { this.query().enableHistory(); }
    else { 
      // Resets the seelction and clears the history buffer while exiting edit mode...
      this.selection.reset().clearHistory(); 
      // ...and reloads the document whenever changed
      if(this.node !== this.source) { 
        this.load(this.source).defrag(); 
      }
    }
  }
  /** change event notifying for document changes */
  @Output() change = new EventEmitter<wmDocument>();
  /** Navigation event triggered when a link is clicked */
  @Output() navigate = new EventEmitter<string>();
  /** Longpress event */
  @Output() longpress = new EventEmitter<KeyboardEvent>();

  ngAfterViewChecked() {
    // Applies the current selection to the document when needed. This is essential even when the selection
    // isn't modified since view changes (aka rendering) affects the selection that requires to be restored
    if(this.editMode && this.selection.marked) {
      // Notifies listeners for document change saving the current selection
      this.change.emit( this.selection.save(this).data );
      // Makes sure to restore the selection after the view has been rendered but anyhow well before
      // the next change will be applied to the data tree (such as while typing) 
      Promise.resolve().then( () => this.apply() ); 
    }
  }

  @HostListener('mouseup', ['$event']) mouseUp(ev: MouseEvent) { 
    // Query the selection, so, it's always up to date
    if(this.editMode) { this.query(); }
  }
  
  @HostListener('keyup', ['$event']) KeyUp(ev: KeyboardEvent) {
    // Query the selection, so, it's always up to date
    if(this.editMode) { this.query(); }
    // Abort longpress on keyUp
    this.longpressClear();
  }

  @HostListener('keydown', ['$event']) keyDown(ev: KeyboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    // Query the selection, so, it's always up to date. 
    const sel = this.query();
    // Runs key accellerators on CTRL hold 
    if(ev.ctrlKey || ev.metaKey) { return this.keyAccellerators(ev); }
    // Edits the content otherwise
    switch(ev.key) {
      /* Navigating falling back to default
      case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight': case 'ArrowUp': case 'Tab':*/
      // Merging foreward
      case 'Delete':
      // Deletes the following char
      return sel.del(), false;
      // Merging backward
      case 'Backspace':
      // Deletes the preceeding char
      return sel.back(), false;
      // Splitting
      case 'Enter':
      // Breaks the current selection on enter
      return sel.break(ev.shiftKey), false;
      // Editing
      default: if(ev.key.length === 1) {
        // Prevents repeating chars whenever LongPress is enabled
        if(ev.repeat && this.longpressEnabled) { return this.longpressDefer(ev, 0), false; }
        // Inserts new content
        return sel.insert(ev.key), false;
      }
    }
    // Fallback to default
    return true;
  }

  @HostListener('cut', ['$event']) editCut(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    // Reverts the cut request to copy the content first...
    this.editCopy(ev);
    // Deletes the selection when succeeded
    this.selection.delete();
    // Always prevent default
    return false;
  } 
  
  @HostListener('copy', ['$event']) editCopy(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    if(!this.selection.valid) { return false; }
    // Gets the clipboard
    const cp = ev.clipboardData || (this.window as any).clipboardData;
    if(!cp) { return true; }
    // Copies the selected tree branch
    const copied = this.selection.copy();
    // Copies the data to the clipboard
    try {
      // Text format first, this should always work 
      cp.setData('text', copied.value );
      // JSON format next
      cp.setData('application/json', JSON.stringify( copied.data ) );
    }
    catch(e) { /*console.error(e);*/ }
    // Prevents default
    return false;
  }

  @HostListener('paste', ['$event']) editPaste(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    if(!this.selection.valid) { return false; }
    // Gets the clipboard
    const cp = (ev.clipboardData || (window as any).clipboardData);
    if(!cp) { return false; }
    // Pastes the data from the clipboard
    try {
      // Tries to paste the json format first
      const json = cp.getData('application/json');
      if(!!json) {
        // Parse the json data into a document fragment
        const fragment = JSON.parse( json ) as wmDocument;
        // Checks for document fragment consistency
        if(fragment.type === 'document' && !!fragment.content) {
          // Pastes the fragment
          this.selection.paste(fragment);
          // Prevents default
          return false;
        }
      }

    }
    catch(e) { /*console.error(e);*/ }
    // When everything else fails, text should always work
    this.selection.insert( cp.getData('text') );
    // Prevents default
    return false;
  }
  
  private keyAccellerators(ev: KeyboardEvent): boolean {

    switch(ev.key) {
      // Size
      case '0': case '1': case '2': case '3': case '5': case '6':
      // Change the selection size
      return this.selection.level = (+ev.key as wmSizeLevel), false;
  
      // Italic format
      case 'i': case 'I':
      // Toggles the selection format
      return this.selection.toggleFormat('italic'), false;
      
      // Bold format
      case 'b': case 'B':
      // Toggles the selection format
      return this.selection.toggleFormat('bold'), false;
      
      // Underline format
      case 'u': case 'U':
      // Toggles the selection format
      return this.selection.toggleFormat('underline'), false;

      case 'z': case 'Z':
      if(!ev.shiftKey) { return this.selection.undo(), false };

      case 'y': case 'Y':
      return this.selection.redo(), false;

    }
    // Reverts to default
    return true;
  }

  /** Queries the document for the current selection */
  public query(): EditableSelection {

    // Query for the document selection range
    const sel = this.document.getSelection();
    const range = (!!sel && sel.rangeCount > 0) && sel.getRangeAt(0);
    if(!!range) {

      // Tracks the caret/selection position
      this.caret = range.getBoundingClientRect();

      // Cut it short on a collapsed range
      if(range.collapsed) {
        // Maps the cursor position at once
        this.selection.setCursor(...this.map(range.startContainer, range.startOffset));
      }
      // Maps the full range otherwise
      else {
        // Maps the selection start node to the data node
        this.selection.setStart(...this.map(range.startContainer, range.startOffset));
        // Maps the selection end node to the data node
        this.selection.setEnd(...this.map(range.endContainer, range.endOffset));
        // Makes sure start node comes always first
        this.selection.sort();
      }
    }
    // Resets the values in case the range is undefined or null
    else { this.selection.setCursor(undefined, 0); }

    // Resets the modified flag
    return this.selection.mark(false);
  }

  private map(node: Node, offset: number): [EditableContent, number]{
    // Skips null nodes
    if(!node) { return [null, 0]; }
    // If node is a text node we look for the parent span element assuming 
    // its ID correctly maps the corresponding tree data editable
    if(node.nodeType === Node.TEXT_NODE) {
      // Gets the text node parent elements (a span or an anchor)
      // note: since IE supports parentElement only on Elements, we cast the parentNode instead
      const element = node.parentNode as Element;
      // Walks the tree searching for the node to return
      const txt = this.walkTree(!!element && element.id);
      // Zeroes the offset on empty texts 
      return [txt, txt.empty ? 0 : offset];    
    }

    const child = node.childNodes[offset] as Node;
    if(!!child && child.nodeType === Node.ELEMENT_NODE) { 
      return [this.walkTree((child as Element).id), 0]; 
    }

    const prev = !!child && child.previousSibling;
    if(!!prev && prev.nodeType === Node.ELEMENT_NODE) { 
      return [this.walkTree((prev as Element).id), -1]; 
    }

    if(node.nodeType === Node.ELEMENT_NODE) { 
      const container = this.walkTree((node as Element).id);
      return [!!container && container.firstDescendant(), 0]; 
    }

    return [null, 0];
  }

  /** Applies the current selection to the document */
  public apply(): EditableSelection {
    // Skips on invalid selections
    if(!this.selection.valid) { return this.selection; }

    try {
      // Gets the current selection
      const sel = this.document.getSelection();
      // Removes all ranges (aka empty the selection)
      sel.removeAllRanges();
      // Creates a new range
      const range = this.document.createRange();
      // Maps the start data nopde to the relevant dom node
      const start = this.dom(this.selection.start, this.selection.startOfs);
      const end = this.selection.collapsed ? start : this.dom(this.selection.end, this.selection.endOfs);
      // Apply the new range to the document
      range.setStart(...start);
      range.setEnd(...end);
      sel.addRange(range);
    }
    catch(e) {}

    // Resets the modified flag
    return this.selection.mark(false);
  }

  private dom(node: EditableContent, offset: number): [Node, number] {
    // Seeks for the dom element matching the internal node id
    const el = !!node ? this.document.getElementById(node.id) : null;
    if(!el) { return null; }// No element found
    // Text nodes are rendered as span elements...
    if(node instanceof EditableInline) {
      //...so seeks for the very first text node within the element children 
      let child = el.firstChild as Node;
      while(!!child) {
        // Basically skips comments
        if(child.nodeType === Node.TEXT_NODE) { return [child, offset]; }
        // Goes next
        child = child.nextSibling;
      }
    }

    // Seeks for the element index position within the parent container
    let child = el as Node; let count = 0;
    while(!!child) { child = child.previousSibling; count++; }
    // Return the parent element with the relative offset otherwise
    return [el.parentNode, count + offset];
  }

  private longpressTimer: number;

  // Returns true whenever the LongPress event is subscribed by an observer
  get longpressEnabled(): boolean { return this.longpress.observers.length > 0; }

  private longpressDefer(ev: KeyboardEvent, delay: number) {
    if(!this.longpressTimer) { 
      setTimeout( ev => this.longpressTimer = (this.longpress.emit(ev), undefined), delay, ev); 
    }
  }

  private longpressClear() {
    if(this.longpressTimer) { 
      this.longpressTimer = ( clearTimeout(this.longpressTimer), undefined ); 
    }
  }
}