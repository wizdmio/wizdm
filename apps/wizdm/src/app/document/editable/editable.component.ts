import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { wmEditable, EditableContent } from './editable-content';
import { DocumentService } from '../document.service';

@Component({
  selector: '[wm-editable]',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class EditableComponent extends EditableContent {

  private edit = false;

  constructor(readonly document: DocumentService) { super(); }

  @Input('wm-editable') root: wmEditable;
/*
  private get selection(): Range {
    return this.document.selection;
  }
*/
  public get text(): string {
    return this.stringify(this.root && this.root.children);
  }
/*
  private insertBreak(range: Range) {

    if(!!this.selection) {

      console.log(this.document.selection);

      const br = this.renderer.createElement('br');

      if(this.selection.collapsed) {

        const end = this.selection.endContainer;
        const ofs = this.selection.endOffset;
        const parent = end.parentNode;
        
        if(end.textContent.length === ofs) {

          let text = br.nextSibling;

          if(!text || text.type !== Node.TEXT_NODE || !parent.contains(text) ) {

            text = this.renderer.createText( '...' );
            this.renderer.insertBefore(parent, text, end.nextSibling);
          }

          this.renderer.insertBefore(parent, br, text);

          this.document.setCursor(text, 0);
        }
        else {

          const content = end.textContent;

          end.textContent = content.substring(0, ofs);

          const text = this.renderer.createText( content.substring(ofs) );

          this.renderer.insertBefore(parent, text, end.nextSibling);
          this.renderer.insertBefore(parent, br, text);

          this.document.setCursor(text, 0);
        }
      }
    }

  }
*/

  @HostBinding('id') get id() {
    return this.elementId(this.root);
  }

  @HostBinding('style.text-align') get align() {
    return this.root && this.root.align;
  }

  @HostBinding('attr.contenteditable') get editable() {
    return this.document.editMode ? 'true' : 'false';
  }
/*
  @HostBinding('attr.data-ref') get ref() {
    return this.root;
  }

  @HostListener('mousedown') onClick() {
    this.edit = this.document.editMode;
  }

  @HostListener('blur') onBlur() {
    this.edit = false;
  }

  @HostListener('keydown', ['$event']) onKeydown(ev: KeyboardEvent) {
    
    switch(ev.key) {
      case 'Enter' :
      //this.insertBreak(this.selection);

      //this.selectTree(this.selection);

      //console.log(this.selection);

      //const sel = this.document.selection;

      //this.walkTree()

      return false;

      default:
      break;
    }
    return true;
  }
*/

}