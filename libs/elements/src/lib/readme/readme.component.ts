import { Component, Input, Output, EventEmitter, Optional } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'
import { rmSegment } from './readme-types';

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

  /** Parsing regex:
   * Escape: '\\([\*\+_~()\[\]{}])' - matches backslashes followed by one of the special chars to renders the char as it is
   * Bold: '\*([^*]*)\*' - matches texts between asterisks '*' to render inside <b> elements
   * Italic: '\+([^+]*)\+' - matches texts between pluses '+' to render inside <i> elements
   * Underline: '_([^_]*)_' - matches texts between underscores '_' to render inside <u> elements
   * Strikethrough: '~([^~]*)~' - matches texts between tildes '~' to render inside <s> elements
   * Anchor: '\[([^\[\]]*)\]\(([^\(\)]+)\)' - matches text within square brakets followed by an url within round brakets '[text](url)' to render as anchors <a> elements
   * Break: '([\n\r\f]+)' - matches newline, linefeed and formfeed special charachers to render as <br> elements 
   */
  private static parsex = /\\([\*\+_~()\[\]{}])|\*([^*]*)\*|\+([^+]*)\+|_([^_]*)_|~([^~]*)~|\[([^\[\]]*)\]\(([^\(\)]+)\)|([\n\r\f]+)/g;
  private static interpolex = /{{\s*([.\w]+)\s*}}/g;

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

  /** (Optional) The context object to interpolate the variable from. */
  @Input() context: any;

  /** Emits the url to navigate to */
  @Output('navigate') nav = new EventEmitter<string>();

  /*
  @Input() color: ThemePalette;

  @Input('disabled') set disabling(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false;
*/

  public compile(source: string, segments: rmSegment[] = this.segments): rmSegment[] {

    let start = 0;
    // Resets the segments array
    this.segments.splice(0);
    // Skips null or emptiìy sources
    if(!source) { return segments; }

    // Parses the input text
    source.replace(ReadmeComponent.parsex, (match: string, esc: string, b: string, i: string, u: string, s: string, a: string, url: string, br: string, offset: number) => {

      // Pushes the text preceeding a match 
      if(offset > start){ 
        const content = source.substring(start, offset);
        this.segments.push({ type: "text", content });   
      }

      // Pushes the matched segment
      if(esc) { this.segments.push({ type: "text", content: esc }); }

      else if(!!b) { this.segments.push({ type: "bold", content: b }); } 

      else if(!!i) { this.segments.push({ type: "italic", content: i }); }
      
      else if(!!u) { this.segments.push({ type: "underline", content: u }); }
      
      else if(!!s) { this.segments.push({ type: "strikethrough", content: s }); }

      else if(!!a) { this.segments.push({ type: "link", content: a, url }); }

      else if(!!br) { this.segments.push({ type: "break" }); }

      // Keeps track of the next beginning for the eventual plain text between this match and the next
      start = offset + match.length;
      return "";
    });

    // Appends the final text chunk 
    if(start < source.length) {
      const content = source.substring(start, source.length);
      this.segments.push({ type: "text", content });
    }

    return segments;
  }

  public interpolate(source: string, context: any = this.context): string {
    return source.replace(ReadmeComponent.interpolex, (match, capture) => {
      return capture.split(".").reduce( (obj, token) => { 
        return obj && obj[token];
      }, context || {});
    });
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
