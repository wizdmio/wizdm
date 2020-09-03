import { Component, Input } from '@angular/core';
import { Token } from 'prismjs';

@Component({ 
  selector: '[tokenize]', 
  templateUrl: './tokenizer.component.html'
}) 
export class PrismTokenizer { 

  public tokens: (string|Token)[];

  /** Tokenizes the input string or pass along the already tokenized array */
  @Input() set tokenize(source: (string|Token)[]) {
    this.tokens = typeof(source) === 'string' ? [source] : source;
  }

  /** Helper for rendering strings */
  isString(token: string|Token): boolean { return typeof(token) === 'string'; } 

  /** Helper for rendering tokens */
  tokenClass(token: Token): string {
    // Returns the basic token class + type and appends the aliases, if any 
    return token ? ('token ' + (token.type || '') + this.tokenAliases(token)) : '';    
  } 

  private tokenAliases(token: Token): string {
    // Skips when no aliases
    if(!token.alias) { return ''; }
    // Appends the multiple aliases
    if(token.alias instanceof Array) {
      return token.alias.reduce( (c, alias) => c + ' ' + alias,'');
    }
    // Appends the single alias
    return ' ' + token.alias;
  }
}