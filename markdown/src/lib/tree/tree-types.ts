// Type and interface definitions of mdast tree nodes {@see: https://github.com/syntax-tree/mdAST}
export type mdContent = mdRoot|mdTopLevelContent|mdListContent|mdTableContent|mdRowContent|mdPhrasingContent;
export type mdTopLevelContent = mdBlockContent|mdDefinitionContent;
export type mdBlockContent = mdParagraph|mdHeading|mdThematicBreak|mdBlockquote|mdList|mdTable|mdCode|mdHTML;
export type mdDefinitionContent = mdDefinition|mdFootnoteDefinition;
export type mdListContent = mdListItem;
export type mdTableContent = mdTableRow;
export type mdRowContent = mdTableCell;
export type mdPhrasingContent = mdStaticPhrasingContent|mdLink|mdLinkReference;
export type mdStaticPhrasingContent = mdText|mdEmphasis|mdStrong|mdDelete|mdHTML|mdInlineCode|mdBreak|mdImage|mdImageReference|mdFootnote|mdFootnoteReference;

export interface mdNode {
  type: string;
  data?: any;
  position?: mdPosition;
}

export interface mdPosition {
  start: mdPoint;
  end: mdPoint;
  indent?: number;
}

export interface mdPoint {
  line: number;
  column: number;
  offset?: number;
}

export interface mdParent extends mdNode {
  children?: mdContent[]
}

export interface mdLiteral extends mdNode {
  value: string;
}

export interface mdRoot extends mdParent {
  type: 'root';
  children?: mdTopLevelContent[];
}

export interface mdParagraph extends mdParent {
  type: 'paragraph';
  children?: mdPhrasingContent[];
}

export interface mdHeading extends mdParent {
  type: 'heading';
  depth: 1|2|3|4|5|6;
}

export interface mdThematicBreak extends mdNode {
  type: 'thematicBreak';
}

export interface mdBlockquote extends mdParent {
  type: 'blockquote';
}

export interface mdList extends mdParent {
  type: 'list';
  ordered?: boolean;
  start?: number;
  children?: mdListContent[];
}

export interface mdListItem extends mdParent {
  type: 'listItem';
  children?: mdBlockContent[];
}

export interface mdTable extends mdParent {
  type: 'table';
  align?: ('left'|'center'|'right')[];
  children?: mdTableContent[];
}

export interface mdTableRow extends mdParent {
  type: 'tableRow';
  children?: mdRowContent[];
}

export interface mdTableCell extends mdParent {
  type: 'tableCell';
  children?: mdPhrasingContent[];
}

export interface mdHTML extends mdLiteral {
  type: 'html'
}

export interface mdCode extends mdLiteral {
  type: 'code';
  lang?: string;
  meta?: string;
}

export interface mdYAML extends mdLiteral {
  type: 'yaml';
}

export interface mdDefinition extends mdNode, mdResource, mdAssociation {
  type: 'definition';
}

export interface mdFootnoteDefinition extends mdParent, mdAssociation {
  type: 'footnoteDefinition';
  children?: mdBlockContent[];
}

export interface mdText extends mdLiteral {
  type: 'text';
}

export interface mdEmphasis extends mdParent {
  type: 'emphasis';
  children?: mdPhrasingContent[];
}

export interface mdStrong extends mdParent {
  type: 'strong';
  children?: mdPhrasingContent[];
}

export interface mdDelete extends mdParent {
  type: 'delete';
  children?: mdPhrasingContent[];
}

export interface mdInlineCode extends mdLiteral {
  type: 'inlineCode';
}

export interface mdBreak extends mdNode {
  type: 'break';
}

export interface mdLink extends mdParent, mdResource {
  type: 'link';
  children?: mdStaticPhrasingContent[];
}

export interface mdImage extends mdNode, mdResource, mdAlternative {
  type: 'image';
}

export interface mdLinkReference extends mdParent, mdReference, mdAlternative {
  type: 'linkReference';
  children?: mdStaticPhrasingContent[];
}

export interface mdImageReference extends mdNode, mdReference {
  type: 'imageReference';
}

export interface mdFootnote extends mdParent {
  type: 'footnote';
  children?: mdPhrasingContent[];
}

export interface mdFootnoteReference extends mdNode, mdReference {
  type: 'footnoteReference';
}

export interface mdResource {
  url: string;
  title?: string;
}

export interface mdAssociation {
  identifier: string;
  label?: string;
}

export interface mdReference extends mdAssociation {
  referenceType: 'shortcut'|'collapsed'|'full';
}

export interface mdAlternative {
  alt?: string;
}
