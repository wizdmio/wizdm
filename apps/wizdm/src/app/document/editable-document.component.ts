import { Component, Inject, AfterViewChecked, Input, HostBinding, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EditableContent } from './common/editable-content';
import { wmDocument, wmTextStyle } from './common/editable-types';
import { EditableSelection } from './selection/editable-selection.service';

@Component({
  selector: 'wm-editable-document, [wm-editable-document]',
  templateUrl: './editable-document.component.html',
  styleUrls: ['./editable-document.component.scss']
})
export class EditableDocument extends EditableContent<wmDocument> implements AfterViewChecked  {

  @HostBinding('attr.contenteditable') get editable() {
    return this.editMode ? 'true' : 'false';
  }

  constructor(@Inject(DOCUMENT) private document: Document, private sel: EditableSelection) { 
    super(null); sel.attach(this);
  }

  @Input() set source(source: wmDocument) {
    // Loads the source data building the tree
    this.load(source);
  }

  private editMode = false;

  @Input() set edit(mode: boolean) { 
    
    if(this.editMode = mode) {
      this.sel.query(this.document);
    }
  }

  get style(): string[] {
    return !!this.sel.start ? this.sel.start.style : [];
  }

  public format(style: wmTextStyle[]) {
    !!this.sel && this.sel.format(style);
  }

  ngAfterViewChecked() {
    // Applies the current selection to the document when needed. This is essential even when the selection
    // isn't modified since view changes (aka rendering) affects the selection that requires to be restored
    if(this.editMode && this.sel.marked) { 
      // Makes sure to restore the selection after the view has been rendered but anyhow ell before
      // the next change will be applied to the data tree (such as while typing) 
      Promise.resolve().then( () => this.sel.apply(this.document) ); 
    }
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('keyup', ['$event']) keyUp(ev: Event) {
    // Query the selection, so, it's always up to date
    if(this.editMode) { this.sel.query(this.document); }
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

  @HostListener('cut', ['$event']) cut(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    // Reverts the cut request to a native copy...
    if( this.document.execCommand('copy') ) {
      // Deletes the selection when succeeded
      this.sel.delete();
    }
    // Prevents default
    return false;
  } 
  
  @HostListener('copy', ['$event']) copy(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }
    //console.log(ev);
    //const text = this.sel.plainText();//.replace('\n', '\r\n');
    //ev.clipboardData.setData('text/plain', this.sel.plainText('\r\n') );
    //ev.clipboardData.setData('text/html', '<b>Hello, world!</b>');

    const copied = this.sel.copy();
    console.log(copied);

    return true;// Perform default
  }

  @HostListener('paste', ['$event']) paste(ev: ClipboardEvent) {
    // Fallback to default while not in edit mode
    if(!this.editMode) { return true; }

    try {

      //console.log(((window as any).clipboardData).getData('text'));

      const html = (ev.clipboardData || (window as any).clipboardData).getData('text/html');

      console.log(html);

      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(html, 'text/html');

      console.log(parsedHtml);
    }
    catch(e) {
      console.error(e);
    }
    //const text = ev.clipboardData.getData('text/plain');
    //console.log(text);

    // Prevents default
    return false;
  }
  
  private keyAccellerators(ev: KeyboardEvent): boolean {

    switch(ev.key) {
      // Cut/Copy/Paste -> Reverts to default
      case 'x': case 'X':
      case 'c': case 'C':
      case 'v': case 'V':
      break;

      // Size
      case '0': case '1': case '2': case '3':
      return this.sel.level = +ev.key, false;
  
      // Italic format
      case 'i': case 'I':
      return this.sel.toggleFormat('italic'), false;
      
      // Bold format
      case 'b': case 'B':
      return this.sel.toggleFormat('bold'), false;
      
      // Underline format
      case 'u': case 'U':
      return this.sel.toggleFormat('underline'), false;
  
    }
    // Reverts to default
    return true;
    }
}

