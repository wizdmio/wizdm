export interface rmNode {
  type: string;
}

export interface rmNodeWithContent extends rmNode {
  content: string;
}

export interface rmBreak extends rmNode {
  type: 'break';
}

export interface rmText extends rmNodeWithContent {
  type: 'text'|'bold'|'italic'|'underline'|'strikethrough';
}

export interface rmLink extends rmNodeWithContent  {
  type: 'link';
  url: string;
}

export type rmSegment = rmText|rmLink|rmBreak;