export type wmInlineType = 'text'|'link';
export type wmIndentType = 'blockquote'|'bulleted'|'numbered';
export type wmNodeType = 'document'|wmIndentType|'item'|'table'|'row'|'cell'|wmInlineType|'frame'|'image';
export type wmAlignType = 'left'|'center'|'right'|'justify';
export type wmVertAlignType = 'top'|'middle'|'bottom';
export type wmTextStyle = 'bold'|'italic'|'underline'|'overline'|'strikethrough'|'super'|'sub';
export type wmEditableTypes = wmDocument | wmBlock | wmList | wmItem | wmTable | wmRow | wmCell | wmText | wmFrame | wmImage;

export interface wmEditable {
  type: wmNodeType,
  align?: wmAlignType,
  level?: number,
  content?: wmEditable[]
}

export interface wmDocument extends wmEditable {
  type: 'document',
  name?: string,
  author?: string,
  version?: string,
  range?: [ number, number ]
}

export interface wmBlock extends wmEditable {
  type: 'blockquote'
}

export interface wmList extends wmEditable {
  type: 'numbered'|'bulleted',
  start?: number,
  content?: (wmItem|wmList)[]
}

export interface wmItem extends wmEditable {
  type: 'item',
  content?: wmText[]
}

export interface wmTable extends wmEditable {
  type: 'table',
  content?: wmRow[]
}

export interface wmRow extends wmEditable {
  type: 'row',
  content?: wmCell[]
}

export interface wmCell extends wmEditable {
  type: 'cell',
  valign?: wmVertAlignType,
  rowspan?: number,
  colspan?: number,
  content?: wmText[]
}

export interface wmText extends wmEditable {
  type: 'text'|'link',
  style?: wmTextStyle[],
  value?: string,
  url?: string
}

export interface wmFrame extends wmEditable {
  type: 'frame',
  content?: wmImage[]
}

export interface wmImage extends wmEditable {
  type: 'image',
  url: string,
  alt?: string,
  title?: string
}