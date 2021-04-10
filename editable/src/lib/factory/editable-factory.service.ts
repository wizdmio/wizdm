import { EditableDocumentData, EditableBlockData, EditableBulletedData, EditableNumberedData, EditableListData, EditableItemData, EditableHeadingData, EditableParagraphData, EditableInlineData, EditableTextData, EditableLinkData, EditableTableData, EditableRowData, EditableCellData, EditableFigureData, EditableImageData, EditableCaptionData, EditableData } from '../model/editable-types';
import { EditableDocument } from '../model/editable-document';
import { EditableBlock } from '../model/editable-block';
import { EditableList } from '../model/editable-list';
import { EditableItem } from '../model/editable-item';
import { EditableInline } from '../model/editable-inline';
import { EditableTable, EditableRow, EditableCell } from '../model/editable-table';
import { EditableFigure, EditableImage, EditableCaption } from '../model/editable-figure';
import { EditableTypes, EditableFactory } from '../model/editable-factory';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditableFactoryService extends EditableFactory {

  node(data: EditableDocumentData): EditableDocument;
  node(data: EditableBlockData): EditableBlock;
  node(data: EditableListData): EditableList;
  node(data: EditableItemData): EditableItem;
  node(data: EditableTableData): EditableTable;
  node(data: EditableRowData): EditableRow;
  node(data: EditableCellData): EditableCell;
  node(data: EditableInlineData): EditableInline;
  node(data: EditableFigureData): EditableFigure;
  node(data: EditableImageData): EditableImage;
  node(data: EditableCaptionData): EditableCaption;

  /** Creates a new empty node of the specified type */
  public node(data: EditableData) { 
    
    switch(!!data && data.type) {

      case 'blockquote':
      return new EditableBlock(this, data as EditableBlockData);

      case 'bulleted':
      return new EditableList(this, data as EditableBulletedData);

      case 'numbered':
      return new EditableList(this, data as EditableNumberedData);

      case 'heading':
      return new EditableItem(this, data as EditableHeadingData);

      case 'paragraph':
      return new EditableItem(this, data as EditableParagraphData);

      case 'text': 
      return new EditableInline(this, data as EditableTextData);

      case 'link':
      return new EditableInline(this, data as EditableLinkData);

      case 'figure':
      return new EditableFigure(this, data as EditableFigureData);

      case 'image':
      return new EditableImage(this, data as EditableImageData);

      case 'table':
      return new EditableTable(this, data as EditableTableData);

      case 'row':
      return new EditableRow(this, data as EditableRowData);

      case 'cell':
      return new EditableCell(this, data as EditableCellData);

      case 'caption':
      return new EditableCaption(this, data as EditableCaptionData);
    }
    // Returns a document node by default
    return new EditableDocument(this, data as EditableDocumentData);
  }

  /** Creates a new empty document node */
  get document() { return this.node({ type: 'document' } as EditableDocumentData); }
  /** Creates a new empty blockquote node */
  get blockquote() { return this.node({ type: 'blockquote' } as EditableBlockData); }
  /** Creates a new empty bullleted list node */
  get bulleted() { return this.node({ type: 'bulleted' } as EditableBulletedData); }
  /** Creates a new empty numbered list node */
  get numbered() { return this.node({ type: 'numbered' } as EditableNumberedData); }
  /** Creates a new empty heading node */
  get heading() { return this.node({ type: 'heading' } as EditableHeadingData); }
  /** Creates a new empty item node */
  get paragraph() { return this.node({ type: 'paragraph' } as EditableParagraphData); }
  /** Creates a new empty table row node */
  get row() { return this.node({ type: 'row' } as EditableRowData); }
  /** Creates a new empty table cell node */
  get cell() { return this.node({ type: 'cell' } as EditableCellData); }
  /** Creates a new empty text node */
  get text() { return this.node({ type: 'text' } as EditableTextData); }
  /** Creates a new empty link node */
  get link() { return this.node({ type: 'link' } as EditableLinkData); }
  /** Creates a new empty figure node */
  get figure() { return this.node({ type: 'figure' } as EditableFigureData); }
  /** Creates a new empty image node */
  get image() { return this.node({ type: 'image' } as EditableImageData); }
  /** Creates a new empty table node */
  get table() { return this.node({ type: 'table' } as EditableTableData); }
  /** Creates a new empty caption node */
  get caption() { return this.node({ type: 'caption' } as EditableCaptionData); }
  
  /** Clones a node with or whithout its children */
  public clone(node: EditableTypes, withChildren: boolean = true): EditableTypes {
    // Creates a new node/tree mirroring this one 
    return this.node(node as any).load( this.sanitize(node, withChildren) ) as EditableTypes;
  }

  private sanitize(node: EditableTypes, withChildren: boolean) {
    // Spreads all the original data values
    const data = { ...node.data } as any;
    // Makes sure children are sanitized as well when requested
    if(withChildren) { data.content = node.content.map( n => this.sanitize(n as EditableTypes, withChildren) );}
    // Othrwise remove the content property at all
    else if(!!data.content) { delete data.content; }
    // Copies the style array, if any
    if(!!(node.data as any).style ) { data.style = [...(node.data as any).style]; }
    // Returns the cloned data payload
    return data;
  }
}