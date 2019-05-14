import { Component, Input } from '@angular/core';
import * as prism from 'prismjs';

@Component({
  selector: 'code[wm-highlight]',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.scss']
})
/** Perform code hilighting by processing an input text to be rendered into an angular template 
 * Using prism as tokenizer @see {https://github.com/PrismJS/prism}
*/
export class CodeHighlighter {

  public tokens: any;

  constructor() {}

  @Input('language') language: string;
  
  @Input('wm-highlight') set highlight(source: string) {
    this.tokens = !!source ? this.tokenize(source, this.language) : [];
  }

  isString(token: any): boolean { 
    return typeof(token) === 'string';
  }

  private tokenize(source: string, language: string): any[] {
    // Select the most appropriate grammar according to the language
    const grammar = language ? prism.languages[language] : undefined;
    // Tokenize the source code. If no loanguage is defined, the full block will be rendered as it is
    return source ? grammar ? prism.tokenize(source, grammar) : [source] : [];
  }
}