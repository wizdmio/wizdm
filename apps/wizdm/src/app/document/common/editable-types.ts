export type wmListType = 'bulletted'|'numbered';
export type wmTableType = 'table'|'row';
export type wmEditableType = 'heading'|'paragraph'|'blockquote'|'item'|'cell';
export type wmInlineType = 'text'|'link';
export type wmImageType = 'image';
export type wmNodeType = 'document'|wmEditableType|wmListType|wmTableType|wmInlineType|wmImageType;
export type wmAlignType = 'left'|'center'|'right'|'justify';
export type wmVertAlignType = 'top'|'middle'|'bottom';
export type wmTextStyle = 'bold'|'italic'|'underline'|'overline'|'strikethrough'|'super'|'sub';

export type wmEditableTypes = wmEditable | wmText | wmHeading | wmList | wmItem | wmTable | wmRow | wmCell;

export interface wmEditable {
  type: wmNodeType,
  align?: wmAlignType,
  children?: wmEditable[]
}

export interface wmText extends wmEditable {
  type: 'text'|'link',
  style?: wmTextStyle[],
  value?: string,
  url?: string
}

export interface wmHeading extends wmEditable {
  type: 'heading',
  level: number,
  children?: wmText[]
}

export interface wmList extends wmEditable {
  type: 'numbered'|'bulletted',
  start?: number
}

export interface wmItem extends wmEditable {
  type: 'item',
  children?: wmText[]
}

export interface wmTable extends wmEditable {
  type: 'table',
  children?: wmRow[]
}

export interface wmRow extends wmEditable {
  type: 'row',
  children?: wmCell[]
}

export interface wmCell extends wmEditable {
  type: 'cell',
  valign?: wmVertAlignType,
  colspan?: number,
  children?: wmText[]
}

export interface wmImage extends wmEditable {
  type: 'image',
  url: string,
  alt?: string,
  title?: string
}

export interface wmDocument extends wmEditable {
  type: 'document',
  header: {
    author?: string,
    version?: string
  }
}