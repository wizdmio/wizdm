import { EditableDoc, EditableBlock, EditableList, EditableItem, EditableText, EditableTable, EditableRow, EditableCell, EditableImage } from '../model';
import { wmNodeType, wmEditableTypes, wmDocument, wmBlock, wmList, wmItem, wmTable, wmRow, wmCell, wmText, wmTextStyle, wmImage } from '../model';
import { Injectable } from '@angular/core';

export type EditableTypes = EditableDoc|EditableBlock|EditableList|EditableItem|EditableTable|EditableRow|EditableCell|EditableText;

@Injectable({
  providedIn: 'root'
})
export class EditableFactory {

  node(type: 'document'): EditableDoc;
  node(type: 'blockquote'): EditableBlock;
  node(type: 'bulleted'|'numbered'): EditableList;
  node(type: 'item'): EditableItem;
  node(type: 'table'): EditableTable;
  node(type: 'row'): EditableRow;
  node(type: 'cell'): EditableCell;
  node(type: 'text'|'link'): EditableText;
  node(type: 'image'): EditableImage;

  /** Creates a new empty node of the specified type */
  public node(type: wmNodeType) { 
    
    switch(type) {

      case 'blockquote':
      return new EditableBlock(this, { type } as wmBlock);

      case 'bulleted': case 'numbered':
      return new EditableList(this, { type } as wmList);

      case 'item':
      return new EditableItem(this, { type } as wmItem);

      case 'table':
      return new EditableTable(this, { type } as wmTable);

      case 'row':
      return new EditableRow(this, { type } as wmRow);

      case 'cell':
      return new EditableCell(this, { type } as wmCell);

      case 'text': case 'link':
      return new EditableText(this, { type } as wmText);

      case 'image':
      return new EditableImage(this, { type } as wmImage);
    }
    // Returns a document node by default
    return new EditableDoc(this, { type: 'document' } as wmDocument);
  }

  /** Creates a new empty document node */
  get document() { return this.node('document'); }
  /** Creates a new empty blockquote node */
  get blockquote() { return this.node('blockquote'); }
  /** Creates a new empty bullleted list node */
  get bulleted() { return this.node('bulleted'); }
  /** Creates a new empty numbered list node */
  get numbered() { return this.node('numbered'); }
  /** Creates a new empty item node */
  get item() { return this.node('item'); }
  /** Creates a new empty table node */
  get table() { return this.node('table'); }
  /** Creates a new empty table row node */
  get row() { return this.node('row'); }
  /** Creates a new empty table cell node */
  get cell() { return this.node('cell'); }
  /** Creates a new empty text node */
  get text() { return this.node('text'); }
  /** Creates a new empty link node */
  get link() { return this.node('link'); }
  /** Creates a new empty image node */
  get image() { return this.node('image'); }
  
  /** Clones a node with or whithout its children */
  public clone(node: EditableTypes, withChildren: boolean = true): EditableTypes {
    // Creates a new node/tree mirroring this one 
    return this.node(node.type as any).load( this.sanitize(node, withChildren) ) as EditableTypes;
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