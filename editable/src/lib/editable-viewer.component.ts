import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { EditableBlockCustomClasses } from './block/block.component';
import type { EditableListCustomClasses } from './list/list.component';
import type { EditableTableCustomClasses } from './table/table.component';
import type { EditableInlineCustomClasses } from './editable/editable.component';
import { EditableFactoryService } from './factory/editable-factory.service';
import { EditableDocument } from './model/editable-document';
import { EditableContent } from './model/editable-content';
import { EditableDocumentData } from './model/editable-types';

/** Document Elements' custom classes */
export interface EditableDocumentCustomClasses 
       extends   EditableBlockCustomClasses, 
                 EditableListCustomClasses,
                 EditableTableCustomClasses,
                 EditableInlineCustomClasses {

  blockquote?: string;         
  figure?    : string;
}

/** Lightweight editable document renderer (read-mode only) */
@Component({
  selector: '[wm-editable-viewer]',
  templateUrl: './editable-viewer.component.html',
  host: { 'class': 'wm-editable-viewer' }
})
export class DocumentViewer extends EditableDocument {

  /** Document source */
  protected source: EditableDocumentData;

  /** Edit mode setter/getter dummies */
  set edit(mode: boolean) { console.warn('DocumentBody edit setter must be overridden', mode); };
  get edit(): boolean { return false; }

  constructor(factory: EditableFactoryService) {
    super(factory, null);
  }

  /** Node selection dummy */
  public isSelected(node: EditableContent) { return false; }
  
  /** Loads the document */
  @Input('wm-editable-viewer') set _source(source: EditableDocumentData) {
    this.load(this.source = source);
  }

  /** Rendered elements' custom classes */
  @Input() customClasses: EditableDocumentCustomClasses;

  /** Navigation event triggered when a link is clicked */
  @Output() navigate = new EventEmitter<string>();
}
