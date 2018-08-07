import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PrismService } from './prism.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'code[wm-highlight]',
  templateUrl: './code-highlight.component.html',
  styleUrls: ['./code-highlight.component.scss']
})
/** Perform code hilighting by processing an input text to be rendered into an angular template 
 * Using prism as tokenizer @see {https://github.com/PrismJS/prism}
*/
export class CodeHighlightComponent implements OnInit, OnDestroy {

  private source$: BehaviorSubject<string> = new BehaviorSubject('');
  private sub$: Subscription;
  public tokens: any[];

  constructor(private prism: PrismService) { }

  @Input('language') language: string;
  @Input('wm-highlight') set highlight(source: string) {
    this.source$.next(source);
  }

  public isString(token: any) {
    return typeof token === 'string';
  }

  public isObject(token: any) {
    return !this.isString(token);
  }

  ngOnInit() {

    // Perform the tokenization asyncronously debouncing the imput to improve performance 
    this.sub$ = this.source$.pipe( debounceTime(500) )
      .subscribe( source => {
        // Tokenize the source code using prism (wrapped into a service for DI)
        this.tokens = source ? this.prism.tokenize(source, this.language) : [];
        //console.log(this.tokens);
      });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }
}