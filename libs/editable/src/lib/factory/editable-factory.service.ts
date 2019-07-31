import { wmEditableTypes, wmRoot, wmBlock, wmList, wmItem, wmTable, wmRow, wmCell, wmText, wmFigure, wmImage, wmCaption } from '../model/editable-types';
import { EditableBlock, EditableList, EditableItem, EditableText } from '../model/editable-text';
import { EditableTable, EditableRow, EditableCell } from '../model/editable-table';
import { EditableFigure, EditableImage, EditableCaption } from '../model/editable-figure';
import { EditableRoot } from '../model/editable-root';
import { Injectable } from '@angular/core';

export type EditableTypes = EditableRoot|EditableBlock|EditableList|EditableItem|EditableTable|EditableRow|EditableCell|EditableText|EditableFigure|EditableImage|EditableCaption;

@Injectable()
export class EditableFactory {

  node(data: wmRoot): EditableRoot;
  node(data: wmBlock): EditableBlock;
  node(data: wmList): EditableList;
  node(data: wmItem): EditableItem;
  node(data: wmTable): EditableTable;
  node(data: wmRow): EditableRow;
  node(data: wmCell): EditableCell;
  node(data: wmText): EditableText;
  node(data: wmFigure): EditableFigure;
  node(data: wmImage): EditableImage;
  node(data: wmCaption): EditableCaption;

  /** Creates a new empty node of the specified type */
  public node(data: wmEditableTypes) { 
    
    switch(!!data && data.type) {

      case 'blockquote':
      return new EditableBlock(this, data as wmBlock);

      case 'bulleted': case 'numbered':
      return new EditableList(this, data as wmList);

      case 'item':
      return new EditableItem(this, data as wmItem);

      case 'table':
      return new EditableTable(this, data as wmTable);

      case 'row':
      return new EditableRow(this, data as wmRow);

      case 'cell':
      return new EditableCell(this, data as wmCell);

      case 'text': case 'link':
      return new EditableText(this, data as wmText);

      case 'figure':
      return new EditableFigure(this, data as wmFigure);

      case 'image':
      return new EditableImage(this, data as wmImage);

      case 'caption':
      return new EditableCaption(this, data as wmCaption);
    }
    // Returns a document node by default
    return new EditableRoot(this, data as wmRoot);
  }

  /** Creates a new empty document node */
  get document() { return this.node({ type: 'document' }); }
  /** Creates a new empty blockquote node */
  get blockquote() { return this.node({ type: 'blockquote' }); }
  /** Creates a new empty bullleted list node */
  get bulleted() { return this.node({ type: 'bulleted' }); }
  /** Creates a new empty numbered list node */
  get numbered() { return this.node({ type: 'numbered' }); }
  /** Creates a new empty item node */
  get item() { return this.node({ type: 'item' }); }
  /** Creates a new empty table node */
  get table() { return this.node({ type: 'table' }); }
  /** Creates a new empty table row node */
  get row() { return this.node({ type: 'row' }); }
  /** Creates a new empty table cell node */
  get cell() { return this.node({ type: 'cell' }); }
  /** Creates a new empty text node */
  get text() { return this.node({ type: 'text' }); }
  /** Creates a new empty link node */
  get link() { return this.node({ type: 'link' }); }
  /** Creates a new empty figure node */
  get figure() { return this.node({ type: 'figure' }); }
  /** Creates a new empty image node */
  get image() { return this.node({ type: 'image' }); }
  /** Creates a new empty caption node */
  get caption() { return this.node({ type: 'caption' }); }
  
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