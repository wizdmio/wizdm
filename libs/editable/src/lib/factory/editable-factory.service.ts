import { EditableDoc, EditableBlock, EditableList, EditableItem, EditableText, EditableTable, EditableRow, EditableCell, EditableFrame, EditableImage } from '../model';
import { wmEditableTypes, wmDocument, wmBlock, wmList, wmItem, wmTable, wmRow, wmCell, wmText, wmFrame, wmImage } from '../model';
import { Injectable } from '@angular/core';

export type EditableTypes = EditableDoc|EditableBlock|EditableList|EditableItem|EditableTable|EditableRow|EditableCell|EditableText|EditableFrame|EditableImage;

@Injectable({
  providedIn: 'root'
})
export class EditableFactory {

  node(data: wmDocument): EditableDoc;
  node(data: wmBlock): EditableBlock;
  node(data: wmList): EditableList;
  node(data: wmItem): EditableItem;
  node(data: wmTable): EditableTable;
  node(data: wmRow): EditableRow;
  node(data: wmCell): EditableCell;
  node(data: wmText): EditableText;
  node(data: wmFrame): EditableFrame;
  node(data: wmImage): EditableImage;

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

      case 'frame':
      return new EditableFrame(this, data as wmFrame);

      case 'image':
      return new EditableImage(this, data as wmImage);
    }
    // Returns a document node by default
    return new EditableDoc(this, data as wmDocument);
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
  /** Creates a new empty image node */
  get frame() { return this.node({ type: 'frame' }); }
  /** Creates a new empty image node */
  get image() { return this.node({ type: 'image' }); }
  
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