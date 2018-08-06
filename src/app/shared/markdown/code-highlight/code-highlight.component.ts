import { Component, OnInit, Input } from '@angular/core';
import { PrismService } from './prism.service';

@Component({
  selector: 'code[wm-highlight]',
  templateUrl: './code-highlight.component.html',
  styleUrls: ['./code-highlight.component.scss']
})
/** Perform code hilighting by processing an input text to be rendered into an angular template 
 * Using prism as tokenizer @see {https://github.com/PrismJS/prism}
*/
export class CodeHighlightComponent implements OnInit {

  @Input('wm-highlight') source: string;
  @Input('language') language: string;

  public tokens: any[];

  constructor(private prism: PrismService) { }

  public isString(token: any) {
    return typeof token === 'string';
  }

  public isObject(token: any) {
    return !this.isString(token);
  }

  ngOnInit() {

    // Tokenize the source code using prism (wrapped into a service for DI)
    this.tokens = this.prism.tokenize(this.source, this.language);
    console.log(this.tokens);
  }
}
