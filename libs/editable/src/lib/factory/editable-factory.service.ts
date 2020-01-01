import { EditableDocument } from '../model/editable-document';
import { EditableBlock } from '../model/editable-block';
import { EditableList } from '../model/editable-list';
import { EditableItem } from '../model/editable-item';
import { EditableInline } from '../model/editable-inline';
import { EditableTable, EditableRow, EditableCell } from '../model/editable-table';
import { EditableFigure, EditableImage, EditableCaption } from '../model/editable-figure';
import { EditableTypes, EditableFactory } from '../model/editable-factory';
import { wmDocument, wmBlock, wmBulleted, wmNumbered, wmList, wmItem, wmHeading, wmParagraph, wmInline, wmText, wmLink, wmTable, wmRow, wmCell, wmFigure, wmImage, wmCaption, wmEditable } from '../model/editable-types';
import { Injectable } from '@angular/core';

@Injectable()
export class EditableFactoryService extends EditableFactory {

  node(data: wmDocument): EditableDocument;
  node(data: wmBlock): EditableBlock;
  node(data: wmList): EditableList;
  node(data: wmItem): EditableItem;
  node(data: wmTable): EditableTable;
  node(data: wmRow): EditableRow;
  node(data: wmCell): EditableCell;
  node(data: wmInline): EditableInline;
  node(data: wmFigure): EditableFigure;
  node(data: wmImage): EditableImage;
  node(data: wmCaption): EditableCaption;

  /** Creates a new empty node of the specified type */
  public node(data: wmEditable) { 
    
    switch(!!data && data.type) {

      case 'blockquote':
      return new EditableBlock(this, data as wmBlock);

      case 'bulleted':
      return new EditableList(this, data as wmBulleted);

      case 'numbered':
      return new EditableList(this, data as wmNumbered);

      case 'heading':
      return new EditableItem(this, data as wmHeading);

      case 'paragraph':
      return new EditableItem(this, data as wmParagraph);

      case 'text': 
      return new EditableInline(this, data as wmText);

      case 'link':
      return new EditableInline(this, data as wmLink);

      case 'figure':
      return new EditableFigure(this, data as wmFigure);

      case 'image':
      return new EditableImage(this, data as wmImage);

      case 'table':
      return new EditableTable(this, data as wmTable);

      case 'row':
      return new EditableRow(this, data as wmRow);

      case 'cell':
      return new EditableCell(this, data as wmCell);

      case 'caption':
      return new EditableCaption(this, data as wmCaption);
    }
    // Returns a document node by default
    return new EditableDocument(this, data as wmDocument);
  }

  /** Creates a new empty document node */
  get document() { return this.node({ type: 'document' } as wmDocument); }
  /** Creates a new empty blockquote node */
  get blockquote() { return this.node({ type: 'blockquote' } as wmBlock); }
  /** Creates a new empty bullleted list node */
  get bulleted() { return this.node({ type: 'bulleted' } as wmBulleted); }
  /** Creates a new empty numbered list node */
  get numbered() { return this.node({ type: 'numbered' } as wmNumbered); }
  /** Creates a new empty heading node */
  get heading() { return this.node({ type: 'heading' } as wmHeading); }
  /** Creates a new empty item node */
  get paragraph() { return this.node({ type: 'paragraph' } as wmParagraph); }
  /** Creates a new empty table row node */
  get row() { return this.node({ type: 'row' } as wmRow); }
  /** Creates a new empty table cell node */
  get cell() { return this.node({ type: 'cell' } as wmCell); }
  /** Creates a new empty text node */
  get text() { return this.node({ type: 'text' } as wmText); }
  /** Creates a new empty link node */
  get link() { return this.node({ type: 'link' } as wmLink); }
  /** Creates a new empty figure node */
  get figure() { return this.node({ type: 'figure' } as wmFigure); }
  /** Creates a new empty image node */
  get image() { return this.node({ type: 'image' } as wmImage); }
  /** Creates a new empty table node */
  get table() { return this.node({ type: 'table' } as wmTable); }
  /** Creates a new empty caption node */
  get caption() { return this.node({ type: 'caption' } as wmCaption); }
  
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