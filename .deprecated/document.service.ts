import { Injectable, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject, fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { wmEditable, wmDocument, EditableContent } from './editable/editable-content';

@Injectable({
  providedIn: "root"
})
export class DocumentService extends EditableContent implements OnDestroy {

  public source: wmDocument;

  public editMode: boolean = true;

  /*
  public setCursor(node: Node, offset: number) {
    this.sel.collapse(node, offset);
  }*/

  private dispose$ = new Subject<void>();

  constructor(@Inject(DOCUMENT) private document: Document) { 
    super();
/*
      fromEvent(this.document, 'keydown')
        .pipe( takeUntil(this.dispose$), filter(() => this.editMode) )
        .subscribe( (ev: KeyboardEvent) => this.keyPressed(ev));

      fromEvent(this.document, 'keyup')
        .pipe( takeUntil(this.dispose$), filter(() => this.editMode) )
        .subscribe( (ev: KeyboardEvent) => this.syncContent());
*/
  }

  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }

  public get window(): Window {
    return this.document.defaultView;
  }

  private selection = new DocumentSelection(null);

  public querySelection(): DocumentSelection {
    
    return this.selection.update(this.document);
  }

  private keyPressed(ev: KeyboardEvent) {
    
    switch(ev.key) {
    
      // Navigation
      case 'ArrowDown' : this.keyDown(ev); break;
      case 'ArrowLeft' : this.keyLeft(ev); break;
      case 'ArrowRight': this.keyRight(ev); break;
      case 'ArrowUp'   : this.keyUp(ev); break;
      case 'Tab'       : this.keyTab(ev); break;
      
      // Merging
      case 'Delete'    : this.keyDelete(ev); break;
      case 'Backspace' : this.keyBack(ev); break;

      // Splitting
      case 'Enter'     : this.keyEnter(ev); break; 

      default:
      break;
    }
  }

  private keyEnter(ev: KeyboardEvent) {
/*
    if(this.selection.collapsed) {

      const from = this.walkTree(this.source,this.selection.fromId);
      const ofs = this.selection.fromOfs;
      //const to = this.walkTree(this.source,this.selection.toId);

      const pos = this.walkPosition(this.selection.fromId).pop();

      from.parentchildren.splice(pos+1, 0, {
        type: 'break'
      } as wmEditable);

      const app = from.value.substring(ofs);
      if(app.length) {

        from.parentchildren.splice(pos+2, 0, {
          type: 'text',
          align: from.align,
          value: app
        } as wmEditable);

        const pre = from.value.substring(0, ofs);
        from.value = pre;
      }
    }
*/
    ev.preventDefault();
  }

  private keyDown(ev) { }
  private keyLeft(ev) { }
  private keyRight(ev) { }
  private keyUp(ev) { }
  private keyTab(ev) { }
  private keyDelete(ev) { }
  private keyBack(ev) { }

  private syncContent() {

    const sel = this.querySelection();
    if(sel.collapsed) {

      this.selection.store(this.document);

      const from = this.walkTree(this.source,this.selection.fromId);

      from.value = sel.text;

      setTimeout( () => { this.selection.restore(this.document)} );
    }

  }

  
}

export class DocumentSelection {

  public fromId: string;
  public fromOfs: number;
  public toId: string;
  public toOfs: number;

  public text: string;

  constructor(doc: Document) {
    this.update(doc);
  }

  private range(doc: Document): Range {
    
    const sel = !!doc && doc.getSelection();

    return sel && sel.rangeCount > 0 && sel.getRangeAt(0);
  }
  
  public get collapsed(): boolean {
    return this.fromId === this.toId;
  }

  private state: Range;

  public store(doc: Document) {
    this.state = this.range(doc);
  }

  public restore(doc: Document) {

    const sel = doc.getSelection();

    sel.removeAllRanges();

    sel.addRange(this.state);
  }

  public update(doc: Document): DocumentSelection {

    const range = this.range(doc);
    
    if(!!range) {

      this.fromId = range.startContainer.parentElement.id;
      this.fromOfs = range.startOffset;

      this.text = range.startContainer.textContent;

      this.toId = range.endContainer.parentElement.id;
      this.toOfs = range.endOffset;
    }
    else {

      this.fromId = this.toId = null;
      this.fromOfs = this.toOfs = 0;
    }

    return this;
  }
}

/*

    fromEvent(this.document, 'selectionchange')
      .pipe( takeUntil(this.dispose$) )
      .subscribe( ev => {
        
        const sel = this.document.getSelection();

        const range = sel && sel.rangeCount > 0 && sel.getRangeAt(0);

        this.selection.update(range);

        const from = this.walkTree(this.source,this.selection.fromId);
        console.log(from);

        const to = this.walkTree(this.source,this.selection.toId);
        console.log(to);

      });

*/