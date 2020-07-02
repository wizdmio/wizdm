export type wmEditable = wmDocument|wmRootContent|wmListContent|wmFigureContent|wmRow|wmCell|wmInline;
export type wmRootContent = wmBlock|wmBlockContent|wmFigure;
export type wmBlockContent =  wmHeading|wmParagraph|wmList;
export type wmList = wmBulleted|wmNumbered;
export type wmListContent  = wmParagraph|wmList;
export type wmIndentable = wmBlock|wmList;
export type wmContainer = wmItem|wmCell|wmCaption;
export type wmItem = wmHeading|wmParagraph;
export type wmInline = wmText|wmLink;
export type wmFigureContent = wmImage|wmTable|wmCaption;
export type wmSizeLevel = 0|1|2|3|4|5|6;
export type wmAlignType = 'left'|'center'|'right'|'justify';
export type wmVertAlignType = 'top'|'middle'|'bottom';
export type wmTextStyle = 'bold'|'italic'|'underline'|'overline'|'strikethrough'|'super'|'sub';
export type wmImageSize = '25'|'33'|'50'|'66'|'75'|'icon'|'thumb'|'small'|'regular';
export type wmNodeType = wmEditable['type'];
export type wmIndentType = wmIndentable['type'];

export interface wmNode {
  type: string;
}

export interface wmParent<T=wmEditable> extends wmNode {
  content?: T[];
} 

export interface wmLiteral extends wmNode {
  value?: string;
}

export interface wmAlignable {
  align?: wmAlignType;
}

export interface wmResource {
  url?: string;
}

export interface wmDocument extends wmParent<wmRootContent> {
  type: 'document';
  name?: string;
  author?: string;
  version?: string;
  range?: [ number, number ];
}

export interface wmBlock extends wmParent<wmBlockContent> {
  type: 'blockquote';
}

export interface wmBulleted extends wmParent<wmListContent> {
  type: 'bulleted';
}

export interface wmNumbered extends wmParent<wmListContent> {
  type: 'numbered';
  start?: number;
}

export interface wmHeading extends wmParent<wmInline>, wmAlignable {
  type: 'heading';
  level?: wmSizeLevel;
}

export interface wmParagraph extends wmParent<wmInline>, wmAlignable {
  type: 'paragraph';
}

export interface wmText extends wmLiteral {
  type: 'text';
  style?: wmTextStyle[];
}

export interface wmLink extends wmLiteral, wmResource {
  type: 'link';
}

export interface wmFigure extends wmParent<wmFigureContent>, wmAlignable {
  type: 'figure';
  content: [wmImage|wmTable, wmCaption?]
}

export interface wmImage extends wmNode, wmResource {
  type: 'image';
  size?: wmImageSize;
  alt?: string;
  title?: string;
}

export interface wmTable extends wmParent<wmRow> {
  type: 'table';
}

export interface wmRow extends wmParent<wmCell> {
  type: 'row';
}

export interface wmCell extends wmParent<wmInline>, wmAlignable {
  type: 'cell';
  valign?: wmVertAlignType;
  rowspan?: number;
  colspan?: number;
}

export interface wmCaption extends wmParent<wmInline>, wmAlignable {
  type: 'caption';
}
