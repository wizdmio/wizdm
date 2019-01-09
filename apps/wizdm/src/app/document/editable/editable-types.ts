export type wmBlockType = 'heading'|'blockquote'|'paragraph'|'image';

export type wmListType = 'list'|'listItem';

export type wmTableType = 'table'|'tableRow'|'tableCell';

export type wmInlineType = 'break'|'text'|'underline'|'sup'|'sub'|'link'|'delete'|'strong'|'emphasis';

export type wmNodeType = 'document' | wmBlockType | wmListType | wmTableType | wmInlineType; 

export type wmAlignType = 'left'|'center'|'right'|'justify';

export interface wmEditable {
  type: wmNodeType,
  align?: wmAlignType,
  value?: string,
  children?: wmEditable[],
  //----------------------
  parent?: wmEditable,
  index?: number,
  depth?: number,
  name?: string,
  remove?: boolean
}

export interface wmHeading extends wmEditable {
  type: 'heading',
  level: number
}

export interface wmBlockquote extends wmEditable {
  type: 'blockquote'
}

export interface wmParagraph extends wmEditable {
  type: 'paragraph'
}

export interface wmEmphasis extends wmEditable {
  type: 'emphasis'
}

export interface wmStrong extends wmEditable {
  type: 'strong'
}

export interface wmDelete extends wmEditable {
  type: 'delete'
}

export interface wmLink extends wmEditable {
  type: 'link',
  url?: string
}

export interface wmSubScript extends wmEditable {
  type: 'sub'
}

export interface wmSuperScript extends wmEditable {
  type: 'sup'
}

export interface wmUnderline extends wmEditable {
  type: 'underline'
}

export interface wmText extends wmEditable {
  type: 'text'
}

export interface wmBreak extends wmEditable {
  type: 'break'
}

export interface wmList extends wmEditable {
  type: 'list',
  ordered?: boolean,
  start?: number
}

export interface wmTableRow extends wmEditable {
  type: 'tableRow'
}

export interface wmTable extends wmEditable {
  type: 'table',
  content?: wmTableRow[]
}

export interface wmImage extends wmEditable {
  type: 'image',
  url: string,
  alt?: string,
  title?: string
}

export interface wmDocument extends wmEditable {
  type: 'document',
  header?: {
    author?: string,
    version?: string
  }
}