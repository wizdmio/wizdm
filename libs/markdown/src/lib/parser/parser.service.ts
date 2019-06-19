import { Injectable } from '@angular/core';
import reparse from './reparse';

// {@see: https://github.com/syntax-tree/mdAST}
export interface mdAST {
  type: string;
  value?: string;
  url?: string;
  alt?: string,
  title?: string,
  identifier?: string;
  children?: mdAST[];
  position?: mdPosition;
}

export interface mdPoint {
  line: number;
  column: number;
  offset?: number;
}

export interface mdPosition {
  start: mdPoint;
  end: mdPoint;
}

@Injectable()
/** Parses a markdown text into an 'mdAST' syntax tree using Remark @see {https://github.com/remarkjs/remark} */
export class MarkdownParser {

  public root: mdAST;
  public defs: mdAST[];
  public notes: mdAST[]; 
    
  constructor() { }

  private get tops(): mdAST[] { return !!this.root && this.root.children || [];}

  /** Parses the markdown source into an mdAST tree */
  public parse(source: string): mdAST {
    // Parses the source into the mdAST tree
    this.root = !!source ? reparse.parse(source) : [];
    // Extracts the definitions (links and images)
    this.defs = this.tops.filter(node => node.type === 'definition');
    // Extracts the footnote definitions
    this.notes = this.tops.filter(node => node.type === 'footnoteDefinition');

    console.log(this.root);
    // Returns the root node
    return this.root;
  }

  /** Seeks for the definition's node of the matching reference  */
  public definition(ref: mdAST): mdAST {
    // Seeks the referred definition node
    return this.defs.find(def => def.identifier === ref.identifier) || {} as mdAST;
  }

  /** Seeks for the footnode definition's node of the matching reference */
  public footnote(ref: mdAST): mdAST {
    // Seeks the referred definition node
    return this.notes.find(def => def.identifier === ref.identifier) || {} as mdAST;
  }

  /** Seeks for the footnote definition index of the matching reference */
  public footnoteIndex(ref: mdAST): number {
    return 1 + this.notes.findIndex(def => def.identifier === ref.identifier);
  }

  /** Parses the tree branch returning a plain concatenated text */ 
  public text(node: mdAST): string {

    if(!node.children || node.children.length <= 0) { return ''; }

    return node.children.reduce((txt: string, child: mdAST) => {

      return txt + ( child.type === 'text' ? child.value : '') + this.text(child);

    }, '');
  }
}