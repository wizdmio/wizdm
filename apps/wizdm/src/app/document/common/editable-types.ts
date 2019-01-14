
export type wmInlineType = 'text'|'bold'|'italic'|'underline'|'delete'|'link'|'sub'|'sup'|'break';
export type wmBlockType = 'heading'|'paragraph'|'blockquote'|'image';
export type wmListType = 'list'|'listItem';
export type wmTableType = 'table'|'tableRow'|'tableCell';
export type wmNodeType = 'document'|wmInlineType|wmBlockType|wmListType|wmTableType;
export type wmAlignType = 'left'|'center'|'right'|'justify';
export type wmVertAlignType = 'top'|'middle'|'bottom';

//export const $textWrappers: wmInlineType[] = ['bold','italic','underline','delete','link','sub','sup'];

export interface wmEditable {
  type: wmNodeType,
  align?: wmAlignType,
  value?: string,
  children?: wmEditable[]
}

export interface wmHeading extends wmEditable {
  type: 'heading',
  level: number
}

export interface wmList extends wmEditable {
  type: 'list',
  ordered?: boolean,
  start?: number
}

export interface wmTable extends wmEditable {
  type: 'table',
  children?: wmTableRow[]
}

export interface wmTableRow extends wmEditable {
  type: 'tableRow',
  head?: boolean,
  foot?: boolean,
  children?: wmTableCell[]
}

export interface wmTableCell extends wmEditable {
  type: 'tableCell',
  valign?: wmVertAlignType,
  colspan?: number
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