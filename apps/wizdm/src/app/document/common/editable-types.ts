//export type wmBlockType = 'paragraph'|'bulleted'|'numbered'|'table'; 
//export type wmEditableType = 'paragraph'|'item'|'cell';
export type wmInlineType = 'text'|'link';
export type wmIndentType = 'blockquote'|'bulleted'|'numbered';
export type wmNodeType = 'document'|wmIndentType|'item'|'table'|'row'|'cell'|wmInlineType|'image';
export type wmAlignType = 'left'|'center'|'right'|'justify';
export type wmVertAlignType = 'top'|'middle'|'bottom';
export type wmTextStyle = 'bold'|'italic'|'underline'|'overline'|'strikethrough'|'super'|'sub';
export type wmEditableTypes = wmEditable | wmText | wmList | wmTable | wmRow | wmCell | wmBlock;

export interface wmEditable {
  type: wmNodeType,
  align?: wmAlignType,
  level?: number,
  children?: wmEditable[]
}

export interface wmDocument extends wmEditable {
  type: 'document',
  header: {
    author?: string,
    version?: string
  }
}

export interface wmBlock extends wmEditable {
  type: 'blockquote',
  note?: boolean
}

export interface wmList extends wmEditable {
  type: 'numbered'|'bulleted',
  start?: number,
  children?: (wmItem|wmList)[]
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
  rowspan?: number,
  colspan?: number,
  children?: wmText[]
}

export interface wmText extends wmEditable {
  type: 'text'|'link',
  style?: wmTextStyle[],
  value?: string,
  url?: string
}

export interface wmImage extends wmEditable {
  type: 'image',
  url: string,
  alt?: string,
  title?: string
}