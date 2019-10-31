import { Component, Input } from '@angular/core';
import { prism } from './prism';

export interface Token {
  type: string;
  content: string|Token[];
};

@Component({ 
  selector: ':not(pre)[wm-prism]', 
  templateUrl: './tokenizer.component.html'
}) 
export class PrismTokenizer { 

  public tokens: (string|Token)[];
  private grammar: any;

  /** Selects the most appropriate grammar according to the language */
  @Input() set language(language: string) {
    this.grammar = !!language ? prism.languages[language] : null;
  }

  /** Tokenizes the input string or pass along the already tokenized array */
  @Input('wm-prism') set highlight(source: string|Token[]) {
    this.tokens = !!source ? typeof(source) === 'string' ? this.tokenize(source) : source : [];
  }

  /** Helper for rendering strings */
  isString(token: string|Token): boolean { return typeof(token) === 'string'; } 

  /** Tokenizes the source text using Prism */
  private tokenize(source: string): (string|Token)[] {
    // Skips invalid source
    if(!source) { return ['']; }
    // Returns the full text as a single token when no grammar is defined
    if(!this.grammar) { return [source]; }
    // Tokenize the source code according to the selected grammar
    return prism.tokenize(source, this.grammar);
  }
}