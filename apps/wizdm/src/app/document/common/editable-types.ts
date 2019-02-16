export type wmEditableType = 'heading'|'paragraph'|'item'|'cell';
export type wmBlockType = 'heading'|'paragraph'|'bulleted'|'numbered'|'table';
export type wmInlineType = 'text'|'link';
export type wmNodeType = 'document'|'blockquote'|wmBlockType|'item'|'row'|'cell'|wmInlineType|'image';
export type wmAlignType = 'left'|'center'|'right'|'justify';
export type wmVertAlignType = 'top'|'middle'|'bottom';
export type wmTextStyle = 'bold'|'italic'|'underline'|'overline'|'strikethrough'|'super'|'sub';
export type wmEditableTypes = wmEditable | wmText | wmHeading | wmList | wmItem | wmTable | wmRow | wmCell | wmBlock;

export interface wmEditable {
  type: wmNodeType,
  align?: wmAlignType,
  //level?: number,
  children?: wmEditable[]
}

export interface wmDocument extends wmEditable {
  type: 'document',
  header: {
    author?: string,
    version?: string
  }
}

export interface wmText extends wmEditable {
  type: 'text'|'link',
  style?: wmTextStyle[],
  value?: string,
  url?: string
}

export interface wmHeading extends wmEditable {
  type: 'heading',
  level?: number,
  children?: wmText[]
}

export interface wmBlock extends wmEditable {
  type: 'blockquote'
}

export interface wmList extends wmEditable {
  type: 'numbered'|'bulleted',
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