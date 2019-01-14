import { Inject, Component, AfterViewChecked, Input, HostBinding, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { wmDocument, EditableContent } from './common/editable-content';
import { EditableSelection } from './common/editable-selection';

@Component({
  selector: 'wm-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements AfterViewChecked {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  private root: EditableContent<wmDocument>;
  private sel: EditableSelection;
  
  @Input() set source(source: wmDocument) {
    // Creates the root node and updates its children
    // deferring descendants nodes to their components
    this.root = new EditableContent(source).update(true);
    // Creates the document selection to map browser selection 
    // to the document data tree
    this.sel = new EditableSelection(this.root, this.document);
  }

  @Input() edit = true;

  @HostBinding('attr.contenteditable') get editable() {
    return this.edit ? 'true' : 'false';
  }

  ngAfterViewChecked() {
    // Applies the current selection to the document when needed. This is essential even when the selection
    // isn't modified since the document selection gets resetted when the involved node(s) are modified 
    // (like view rendering after content update)
    this.sel.apply();
    
  }

  @HostListener('keydown', ['$event']) keyPressed(ev: KeyboardEvent) {

    // Fallback to default while not in edit mode
    if(!this.edit) { return true; }

    if(ev.repeat) { return false; }
    
    switch(ev.key) {
  /*  
      // Navigation
      case 'ArrowDown' : return this.keyDown(ev);
      case 'ArrowLeft' : return this.keyLeft(ev);
      case 'ArrowRight': return this.keyRight(ev);
      case 'ArrowUp'   : return this.keyUp(ev);
      case 'Tab'       : return this.keyTab(ev);
  */    
      // Merging
      case 'Delete':
      this.sel.query();
      return this.sel.delete();
      //return false;
      
      case 'Backspace': 
      this.sel.query();
      return this.sel.backspace();
      //return false;

      // Splitting
      case 'Enter':
      this.sel.query();
      return this.sel.enter();
      //return false; 

      // Editing
      default: if(ev.key.length === 1) {
        this.sel.query();
        return this.sel.insert();
      }

    }
    // Default
    return  true;
  }
/*
  @HostListener('keydown', ['$event']) keyReleased(ev: KeyboardEvent) {

    if(ev.key.length === 1) {
  
      this.sel.query();
      console.log( this.sel.content );
    }
  }
*/
/*
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
*/
}

