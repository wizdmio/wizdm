import { Injectable, Inject, Optional } from '@angular/core';
import { mdRoot, mdContent, mdParent, mdTopLevelContent, mdDefinition, mdReference, mdFootnoteDefinition, mdFootnoteReference, mdPoint, mdPosition } from './tree-types';
import { MarkdownConfig, mdConfigToken } from './tree-config';
import { setupParser } from './reparse';

@Injectable()
/** Parses a markdown text into an 'mdContent' syntax tree using Remark @see {https://github.com/remarkjs/remark} */
export class MarkdownTree {

  public root: mdRoot;
  public defs: mdDefinition[];
  public notes: mdFootnoteDefinition[]; 
  private reparse: any;

  constructor(@Optional() @Inject(mdConfigToken) readonly config: MarkdownConfig) {
    // Setups the parser
    this.reparse = setupParser(config || {});
  }
  
  /** Top level nodes (root's children) */
  public get tops(): mdTopLevelContent[] { return !!this.root && this.root.children || [];}

  /** Parses the markdown source into an mdContent tree */
  public parse(source: string): mdRoot {
    // Parses the source into the mdContent tree
    this.root = !!source ? this.reparse.parse(source) : [];
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
    return this.defs.find(def => def.identifier === ref.identifier);
  }

  /** Seeks for the footnode definition's node of the matching reference */
  public footnote(ref: mdFootnoteReference): mdFootnoteDefinition {
    // Seeks the referred definition node
    return this.notes.find(def => def.identifier === ref.identifier);
  }

  /** Seeks for the footnote definition index of the matching reference */
  public footnoteIndex(ref: mdFootnoteDefinition): number {
    return 1 + this.notes.findIndex(def => def.identifier === ref.identifier);
  }

  /** Parses the tree branch returning a plain concatenated text */ 
  public text(node: mdContent): string {

    return ("children" in node) ? (node as mdParent).children.reduce((txt: string, child: mdContent) => {

      return txt + (child.type === 'text' ? child.value : '') + this.text(child);

    }, '') : '';
  }
}
