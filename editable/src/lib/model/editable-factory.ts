import { EditableDocumentData, EditableBlockData, EditableListData, EditableItemData, EditableInlineData, EditableTableData, EditableRowData, EditableCellData, EditableFigureData, EditableImageData, EditableCaptionData, EditableData } from './editable-types';
import { EditableDocument } from './editable-document';
import { EditableBlock } from './editable-block';
import { EditableList } from './editable-list';
import { EditableItem } from './editable-item';
import { EditableInline } from './editable-inline';
import { EditableTable, EditableRow, EditableCell } from './editable-table';
import { EditableFigure, EditableImage, EditableCaption } from './editable-figure';

export type EditableTypes = EditableDocument|EditableBlock|EditableList|EditableItem|EditableTable|EditableRow|EditableCell|EditableInline|EditableFigure|EditableImage|EditableCaption;

export abstract class EditableFactory {

  /** Creates a new empty node of the specified type */
  public abstract node(data: EditableDocumentData): EditableDocument;
  public abstract node(data: EditableBlockData): EditableBlock;
  public abstract node(data: EditableListData): EditableList;
  public abstract node(data: EditableItemData): EditableItem;
  public abstract node(data: EditableTableData): EditableTable;
  public abstract node(data: EditableRowData): EditableRow;
  public abstract node(data: EditableCellData): EditableCell;
  public abstract node(data: EditableInlineData): EditableInline;
  public abstract node(data: EditableFigureData): EditableFigure;
  public abstract node(data: EditableImageData): EditableImage;
  public abstract node(data: EditableCaptionData): EditableCaption;
  public abstract node(data: EditableData): EditableTypes;

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
