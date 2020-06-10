import { Component, Input, Output, EventEmitter, Optional } from '@angular/core';
import { rmSegment, rmText, rmLink } from './readme-types';
import { EmojiMode } from '@wizdm/emoji/utils';

/** Navigation service token */
export abstract class ReadmeNavigator {
  public abstract navigate(url: string): boolean|Promise<boolean>;
}

@Component({
  selector: '[wm-readme]',
  templateUrl: './readme.component.html',
  host: { 'class': 'wm-readme' }
})
export class ReadmeComponent {

  readonly segments: rmSegment[] = [];

  constructor(@Optional() private navigator: ReadmeNavigator) {

    if(!!navigator && typeof(navigator.navigate) !== 'function') {
      throw new Error('Invalid ReadmeNavigator provided!');
    }
  }

  /** Plain text souce input */
  @Input('wm-readme') set parse(source: string) {
    this.compile(source); 
  }

  /** Emoji Rendering Mode */
  @Input() emojiMode: EmojiMode;

  /** Emits the url to navigate to */
  @Output('navigate') nav = new EventEmitter<string>();

  // Tracking function to render the segments by content preventing re-rendering segments where content is unchanged
  public trackByFn(index: number, item: rmSegment) {
    return item.type + (item as rmText).content || '' + (item as rmLink).url || '';
  }

  /** Compiles the input text into segments */
  private compile(source: string): rmSegment[] {

    // Resets the segments array
    this.segments.splice(0);
    // Skips null or emptiìy sources
    if(!source) { return this.segments; }

    /** Parsing regex:
     * 1st - Styling match - "([*+_~])(.*?[^\\])\1" 
     * Matches sequences starting with '*', '+', '_' or '~' end ending with the very same character as soon as it isn't preceeded by a '\' 
     * to render <b>, <i>, <u> or <s> elements respectively.
     * 2nd - Anchor match - "\[(.*?)\]\((.+?)\)"
     * matches text within square brakets followed by an url within round brakets '[text](url)' to render as anchors <a> elements.
     * 3rd - Escape match - Matches backslashes followed by one of the special chars to renders the char as it is.
     * 4th - Break match: '\n' 
     * matches the newline charachers to render <br> elements 
     */
    let start = 0; let match; const rx = /([*+_~])(.*?[^\\])\1|\[(.*?)\]\((.+?)\)|\\([*+_~])|\n/g;
    while(match = rx.exec(source)) {

      // Prevents the zero-length match infinite loop for all browsers
      if(match.index == rx.lastIndex) { rx.lastIndex++ };

      // Pushes the text preceeding a match 
      if(match.index > start){ 
        const content = source.substring(start, match.index);
        this.segments.push({ type: "text", content });   
      }
 
      // Breaks
      if(match[0] === '\n') { this.segments.push({ type: "break" }); }
      // Styled texts
      else if(match[1]) { 

        const type = match[1] === '*' ? 'bold' : ( match[1] === '+' ? 'italic' : ( match[1] === '_' ? 'underline' : 'strikethrough' ));
        this.segments.push( { type, content: match[2] });
      }
      // Links
      else if(match[3]) { this.segments.push({ type: "link", content: match[3], url: match[4] }); }
      // Escapes
      else if(match[5]) { this.segments.push({ type: "text", content: match[5] }); };

      // Moves to the next text segment
      start = match.index + match[0].length;
    }

    // Appends the final text chunk 
    if(rx.lastIndex < source.length) {
      const content = source.substring(start, source.length);
      this.segments.push({ type: "text", content });
    }

    return this.segments;
  }

  /** True whenever the navigate output is used */
  get eventNavigation(): boolean { return this.nav.observers.length > 0; }

  /** True whenever a ReadmeNavigator has been provided */
  get serviceNavigation(): boolean { return !!this.navigator; }

  /** Navigates to the specified url */
  public navigate(url: string): boolean {
    // Emits on the navigate output
    if(this.eventNavigation) { return this.nav.emit(url), false; }
    // Calls upon the ReadmeNavigator
    if(this.serviceNavigation) { return this.navigator.navigate(url), false; }
    // No navigation handlers...
    console.log("Navigation missed:", url);
    // Prevents default
    return false;
  }
}
