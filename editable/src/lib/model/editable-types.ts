export type EditableData = EditableDocumentData|EditableRootContentData|EditableListContentData|EditableFigureContentData|EditableRowData|EditableCellData|EditableInlineData;
export type EditableRootContentData = EditableBlockData|EditableBlockContentData|EditableFigureData;
export type EditableBlockContentData = EditableHeadingData|EditableParagraphData|EditableListData;
export type EditableListData = EditableBulletedData|EditableNumberedData;
export type EditableListContentData = EditableParagraphData|EditableListData;
export type EditableIndentableData = EditableBlockData|EditableListData;
export type EditableContainerData = EditableItemData|EditableCellData|EditableCaptionData;
export type EditableItemData = EditableHeadingData|EditableParagraphData;
export type EditableInlineData = EditableTextData|EditableLinkData;
export type EditableFigureContentData = EditableImageData|EditableTableData|EditableCaptionData;
export type EditableSizeLevel = 0|1|2|3|4|5|6;
export type EditableAlignType = 'left'|'center'|'right'|'justify';
export type EditableVertAlignType = 'top'|'middle'|'bottom';
export type EditableTextStyle = 'bold'|'italic'|'underline'|'overline'|'strikethrough'|'super'|'sub';
export type EditableImageSize = '25'|'33'|'50'|'66'|'75'|'icon'|'thumb'|'small'|'regular';
export type EditableNodeType = EditableData['type'];
export type EditableIndentType = EditableIndentableData['type'];

export interface EditableNode {
  type: string;
}

export interface EditableParentNode<T=EditableData> extends EditableNode {
  content?: T[];
} 

export interface EditableLiteralNode extends EditableNode {
  value?: string;
}

export interface EditableAlignableData {
  align?: EditableAlignType;
}

export interface EditableResourceData {
  url?: string;
}

export interface EditableDocumentData extends EditableParentNode<EditableRootContentData> {
  type: 'document';
  title?: string;
  author?: string;
  version?: string;
  range?: [ number, number ];
}

export interface EditableBlockData extends EditableParentNode<EditableBlockContentData> {
  type: 'blockquote';
}

export interface EditableBulletedData extends EditableParentNode<EditableListContentData> {
  type: 'bulleted';
}

export interface EditableNumberedData extends EditableParentNode<EditableListContentData> {
  type: 'numbered';
  start?: number;
}

export interface EditableHeadingData extends EditableParentNode<EditableInlineData>, EditableAlignableData {
  type: 'heading';
  level?: EditableSizeLevel;
}

export interface EditableParagraphData extends EditableParentNode<EditableInlineData>, EditableAlignableData {
  type: 'paragraph';
}

export interface EditableTextData extends EditableLiteralNode {
  type: 'text';
  style?: EditableTextStyle[];
}

export interface EditableLinkData extends EditableLiteralNode, EditableResourceData {
  type: 'link';
}

export interface EditableFigureData extends EditableParentNode<EditableFigureContentData>, EditableAlignableData {
  type: 'figure';
  content: [EditableImageData|EditableTableData, EditableCaptionData?]
}

export interface EditableImageData extends EditableNode, EditableResourceData {
  type: 'image';
  size?: EditableImageSize;
  alt?: string;
  title?: string;
}

export interface EditableTableData extends EditableParentNode<EditableRowData> {
  type: 'table';
}

export interface EditableRowData extends EditableParentNode<EditableCellData> {
  type: 'row';
}

export interface EditableCellData extends EditableParentNode<EditableInlineData>, EditableAlignableData {
  type: 'cell';
  valign?: EditableVertAlignType;
  rowspan?: number;
  colspan?: number;
}

export interface EditableCaptionData extends EditableParentNode<EditableInlineData>, EditableAlignableData {
  type: 'caption';
}
