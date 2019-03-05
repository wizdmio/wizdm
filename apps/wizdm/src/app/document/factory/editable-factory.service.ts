import { EditableDoc, EditableBlock, EditableList, EditableItem, EditableText, EditableTable, EditableRow, EditableCell, EditableImage } from '../model';
import { wmEditableTypes, wmDocument, wmBlock, wmList, wmItem, wmTable, wmRow, wmCell, wmText, wmImage } from '../model';
import { Injectable } from '@angular/core';

export type EditableTypes = EditableDoc|EditableBlock|EditableList|EditableItem|EditableTable|EditableRow|EditableCell|EditableText;

@Injectable({
  providedIn: 'root'
})
export class EditableFactory {

  get document() { return this.create({ type:'document' }); }

  create(data: wmDocument): EditableDoc;
  create(data: wmBlock): EditableBlock;
  create(data: wmList): EditableList;
  create(data: wmItem): EditableItem;
  create(data: wmTable): EditableTable;
  create(data: wmRow): EditableRow;
  create(data: wmCell): EditableCell;
  create(data: wmText): EditableText;

  public create(data: wmEditableTypes) { 
    
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

      case 'image':
      return new EditableImage(this, data as wmImage);
    }
    // Returns a document node by default
    return new EditableDoc(this, {...data, type: 'document' });
  }

  /** Clones a node with or whithout its children */
  public clone(node: EditableTypes, withChildren: boolean = true): EditableTypes {
    // Creates a new node/tree mirroring this one 
    return this.create(node.data as any).load( this.sanitize(node, withChildren) ) as EditableTypes;
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