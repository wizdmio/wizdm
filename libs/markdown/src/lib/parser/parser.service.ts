import { Injectable } from '@angular/core';
import { mdRoot, mdContent, mdParent, mdTopLevelContent, mdDefinition, mdReference, mdFootnoteDefinition, mdFootnoteReference, mdPoint, mdPosition } from './parser-types';
import reparse from './reparse';


@Injectable({
  providedIn: 'root'
})
/** Parses a markdown text into an 'mdContent' syntax tree using Remark @see {https://github.com/remarkjs/remark} */
export class MarkdownParser {

  public root: mdRoot;
  public defs: mdDefinition[];
  public notes: mdFootnoteDefinition[]; 
    
  constructor() { }

  private get tops(): mdTopLevelContent[] { return !!this.root && this.root.children || [];}

  /** Parses the markdown source into an mdContent tree */
  public parse(source: string): mdRoot {
    // Parses the source into the mdContent tree
    this.root = !!source ? reparse.parse(source) : [];
    // Extracts the definitions (links and images)
    this.defs = this.tops.filter(node => node.type === 'definition') as mdDefinition[];
    // Extracts the footnote definitions
    this.notes = this.tops.filter(node => node.type === 'footnoteDefinition') as mdFootnoteDefinition[];
    // Returns the root node
    return this.root;
  }

  /** Seeks for the definition's node of the matching reference  */
  public definition(ref: mdReference): mdDefinition {
    // Seeks the referred definition node
    return this.defs.find(def => def.identifier === ref.identifier) || {} as mdDefinition;
  }

  /** Seeks for the footnode definition's node of the matching reference */
  public footnote(ref: mdFootnoteReference): mdFootnoteDefinition {
    // Seeks the referred definition node
    return this.notes.find(def => def.identifier === ref.identifier) || {} as mdFootnoteDefinition;
  }

  /** Seeks for the footnote definition index of the matching reference */
  public footnoteIndex(ref: mdFootnoteDefinition): number {
    return 1 + this.notes.findIndex(def => def.identifier === ref.identifier);
  }

  /** Parses the tree branch returning a plain concatenated text */ 
  public text(node: mdContent): string {

    const parent = ("children" in node) ? node as mdParent : null;

    return !!parent && parent.children.reduce((txt: string, child: mdContent) => {

      return txt + (child.type === 'text' ? child.value : '') + this.text(child);

    }, '');
  }
}