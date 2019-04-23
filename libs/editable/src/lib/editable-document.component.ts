import { Component, Inject, AfterViewChecked, Input, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EditableFactory } from './factory/editable-factory.service';
import { EditableSelection } from './selection/editable-selection.service';
import { EditableDoc, wmDocument } from './model';

@Component({
  selector: 'wm-editable-document, [wm-editable-document]',
  templateUrl: './editable-document.component.html',
  styleUrls: ['./editable-document.component.scss'],
  host: { 'class': 'wm-editable-document' }
})
export class EditableDocument extends EditableDoc implements AfterViewChecked {

  @HostBinding('attr.contenteditable') get editable() {
    return this.editMode ? 'true' : 'false';
  }

  constructor(@Inject(DOCUMENT) private document: Document, private sel: EditableSelection, factory: EditableFactory) { 
    super(factory, null); 
    // Makes sure a minimal document exists prior to attach the selection
    this.new().sel.attach(this);
  }

  /** Document source */
  @Input() set source(source: wmDocument) {
    // Loads the source data building the tree
    this.load(source).defrag();
  }

  private editMode = false;

  /** When true switches to edit mode */
  @Input() set edit(mode: boolean) { 
    // Switches to/from edit mode
    if(this.editMode = mode) {
      // Queries for the current selection
      this.sel.query(this.document)
        // Initializes the history buffer
        .enableHistory()
    }
    // Resets the seelction and clears the history buffer while exiting edit mode
    else { this.sel.reset().clearHistory(); }
  }
  /** change event notifying for document changes */
  @Output() change = new EventEmitter<wmDocument>();

  ngAfterViewChecked() {
    // Applies the current selection to the document when needed. This is essential even when the selection
    // isn't modified since view changes (aka rendering) affects the selection that requires to be restored
    if(this.editMode && this.sel.marked) {
      // Notifies listeners for document change saving the current selection
      this.change.emit( this.sel.save(this).data );
      // Makes sure to restore the selection after the view has been rendered but anyhow well before
      // the next change will be applied to the data tree (such as while typing) 
      Promise.resolve().then( () => this.sel.apply(this.document) ); 
    }
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('keyup', ['$event']) up(ev: Event) {
    // Query the selection, so, it's always up to date
    if(this.editMode) { this.sel.query(this.document); }

    console.log(this.sel.start);
  }

  @HostListener('keydown', ['$event']) keyDown(ev: KeyboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    // Query the selection, so, it's always up to date. 
    this.sel.query(this.document);
    // Runs key accellerators on CTRL hold 
    if(ev.ctrlKey || ev.metaKey) { return this.keyAccellerators(ev); }
    // Edits the content otherwise
    switch(ev.key) {
      /*// Navigating
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'Tab':*/
      // Merging foreward
      case 'Delete':
      // Extends the selection one char forward when collapsed
      if(this.sel.collapsed) { this.sel.move(0, 1); }
      // Deletes the selection
      return this.sel.delete(), false;
      // Merging backward
      case 'Backspace':
      // extends the selection one char backward when collapsed
      if(this.sel.collapsed) { this.sel.move(-1, 0); }
      // Deletes the selection
      return this.sel.delete(), false;
      // Splitting
      case 'Enter':
      // Breaks the current selection on enter
      return this.sel.break(ev.shiftKey), false;
      // Editing
      default: if(ev.key.length === 1) {
        // Inserts new content
        return this.sel.insert(ev.key), false;
      }
    }
    // Fallback to default
    return true;
  }

  private get window(): Window {
    return this.document.defaultView;
  }

  @HostListener('cut', ['$event']) editCut(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    // Reverts the cut request to copy the content first...
    this.editCopy(ev);
    // Deletes the selection when succeeded
    this.sel.delete();
    // Always prevent default
    return false;
  } 
  
  @HostListener('copy', ['$event']) editCopy(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    if(!this.sel.valid) { return false; }
    // Gets the clipboard
    const cp = ev.clipboardData || (this.window as any).clipboardData;
    if(!cp) { return true; }
    // Copies the selected tree branch
    const copied = this.sel.copy();
    // Copies the data to the clipboard
    try {
      // Text format first, this should always work 
      cp.setData('text', copied.value );
      // JSON format 
      cp.setData('application/json', JSON.stringify( copied.data ) );
    }
    catch(e) { /*console.error(e);*/}
    // Prevents default
    return false;
  }

  @HostListener('paste', ['$event']) editPaste(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    if(!this.sel.valid) { return false; }
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
          this.sel.paste(fragment);
          // Prevents default
          return false;
        }
      }

    }
    catch(e) { /*console.error(e);*/ }
    // When everything else fails, text should always work
    this.sel.insert( cp.getData('text') );
    // Prevents default
    return false;
  }
  
  private keyAccellerators(ev: KeyboardEvent): boolean {

    switch(ev.key) {
      // Size
      case '0': case '1': case '2': case '3':
      // Change the selection size
      return this.sel.level = +ev.key, false;
  
      // Italic format
      case 'i': case 'I':
      // Toggles the selection format
      return this.sel.toggleFormat('italic'), false;
      
      // Bold format
      case 'b': case 'B':
      // Toggles the selection format
      return this.sel.toggleFormat('bold'), false;
      
      // Underline format
      case 'u': case 'U':
      // Toggles the selection format
      return this.sel.toggleFormat('underline'), false;

      case 'z': case 'Z':
      if(!ev.shiftKey) { return this.sel.undo(), false };

      case 'y': case 'Y':
      return this.sel.redo(), false;

    }
    // Reverts to default
    return true;
  }
}
