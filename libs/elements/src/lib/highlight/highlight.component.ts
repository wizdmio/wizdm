import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: '[wm-highlight]',
  templateUrl: './highlight.component.html',
  host: { 'class': 'wm-highlight' }
})
export class HighlightComponent implements OnChanges {

  readonly tokens: (string|{ highlight: boolean, content: string })[] = [];
  private rx: RegExp;

  @Input() pattern: string|RegExp;

  @Input('wm-highlight') source: string;

  @Input() color: ThemePalette;

  ngOnChanges(changes: SimpleChanges) {

    if(!!changes.pattern) {

      this.rx = null;

      if(this.pattern instanceof RegExp) { 
        this.rx = this.pattern; 
      }

      if(!!this.pattern && typeof(this.pattern) === 'string') { 
        // Builds a default regex to match the input string pattern
        // at every word boundary case insensitive
        this.rx = new RegExp(`\\b${this.pattern||'\\B'}`, 'ig'); 
      }
    }

    if(!!changes.source || !!changes.pattern) {
     
     this.compile(this.source, this.rx);
    }
  } 
 
  private compile(source: string, rx: RegExp) {

    // Resets the segments array
    this.tokens.splice(0);

    // Skips null or emptiìy sources
    if(!source) { return; }

    if(!rx) { this.tokens.push(source); return; }

    rx.lastIndex = 0;

    let start = 0; let match;
    while(match = rx.exec(source)) {

      // Prevents the zero-length match infinite loop for all browsers
      if(match.index == rx.lastIndex) { rx.lastIndex++ };

      // Pushes the text preceeding a match 
      if(match.index > start) {
        const text = source.substring(start, match.index); 
        this.tokens.push( text );   
      }

      const content = match[0];
      this.tokens.push({ highlight: true, content });
      
      // Moves to the next text segment
      start = match.index + match[0].length;
    }

    // Appends the final text chunk 
    if(rx.lastIndex < source.length) {
      const text = source.substring(start, source.length);
      this.tokens.push( text );
    }
  }
}