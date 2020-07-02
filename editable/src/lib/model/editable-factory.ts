import { EditableDocument } from './editable-document';
import { EditableBlock } from './editable-block';
import { EditableList } from './editable-list';
import { EditableItem } from './editable-item';
import { EditableInline } from './editable-inline';
import { EditableTable, EditableRow, EditableCell } from './editable-table';
import { EditableFigure, EditableImage, EditableCaption } from './editable-figure';
import { wmDocument, wmBlock, wmList, wmItem, wmInline, wmTable, wmRow, wmCell, wmFigure, wmImage, wmCaption, wmEditable } from './editable-types';

export type EditableTypes = EditableDocument|EditableBlock|EditableList|EditableItem|EditableTable|EditableRow|EditableCell|EditableInline|EditableFigure|EditableImage|EditableCaption;

export abstract class EditableFactory {

  /** Creates a new empty node of the specified type */
  public abstract node(data: wmDocument): EditableDocument;
  public abstract node(data: wmBlock): EditableBlock;
  public abstract node(data: wmList): EditableList;
  public abstract node(data: wmItem): EditableItem;
  public abstract node(data: wmTable): EditableTable;
  public abstract node(data: wmRow): EditableRow;
  public abstract node(data: wmCell): EditableCell;
  public abstract node(data: wmInline): EditableInline;
  public abstract node(data: wmFigure): EditableFigure;
  public abstract node(data: wmImage): EditableImage;
  public abstract node(data: wmCaption): EditableCaption;
  public abstract node(data: wmEditable): EditableTypes;

  /** Creates a new empty document node */
  abstract get document(): EditableDocument;
  /** Creates a new empty blockquote node */
  abstract get blockquote(): EditableBlock;
  /** Creates a new empty bullleted list node */
  abstract get bulleted(): EditableList;
  /** Creates a new empty numbered list node */
  abstract get numbered(): EditableList;
  /** Creates a new empty heading node */
  abstract get heading(): EditableItem;
  /** Creates a new empty item node */
  abstract get paragraph(): EditableItem;
  /** Creates a new empty table row node */
  abstract get row(): EditableRow;
  /** Creates a new empty table cell node */
  abstract get cell(): EditableCell;
  /** Creates a new empty text node */
  abstract get text(): EditableInline;
  /** Creates a new empty link node */
  abstract get link(): EditableInline;
  /** Creates a new empty figure node */
  abstract get figure(): EditableFigure;
  /** Creates a new empty image node */
  abstract get image(): EditableImage;
  /** Creates a new empty table node */
  abstract get table(): EditableTable;
  /** Creates a new empty caption node */
  abstract get caption(): EditableCaption;
  
  /** Clones a node with or whithout its children */
  public abstract clone(node: EditableTypes, withChildren: boolean): EditableTypes;
}
