import { Component, Input, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { PrismService } from '../prism.service';
import { Observable } from 'rxjs';
import { TokenStream } from 'prismjs';

@Component({
  selector: 'pre[wm-prism]',
  templateUrl: './highlighter.component.html'
})
/** Perform code hilighting by processing an input text to be rendered into an angular template 
 * Using prism as tokenizer @see {https://github.com/PrismJS/prism} */
export class PrismHighlighter { 

  public tokens$: Observable<TokenStream>;

  constructor(private prism: PrismService) {}

  /** Applies the proper classes to the host <pre> element */
  @HostBinding('class') get clazz() {
    return `wm-prism${this.disabled ? '' : ' language-none'}`;
  }
  
  /** Disables the highlighting */
  @Input('disabled') set disableHighlight(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false;

  /** Selects the language */
  @Input() language: string;
  
  /** Parses the source text */
  @Input('wm-prism') set source(source: string) {
    this.tokens$ = this.prism.tokenize(source, this.language);
  }
}
