import { Component, Input, Output, EventEmitter, Optional } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'
import { rmSegment } from './readme-types';

/** Parsing regex:
   * 1st - Styling match - "([*+_~])(.*?)(?<!\\)\1" 
   * Matches sequences starting with '*', '+', '_' or '~' end ending with the very same character except when preceeded by a '\' 
   * to render <b>, <i>, <u> or <s> elements respectively.
   * 2nd - Anchor match - "\[(.*?)\]\((.+?)\)"
   * matches text within square brakets followed by an url within round brakets '[text](url)' to render as anchors <a> elements.
   * 3rd - Escape match - Matches backslashes followed by one of the special chars to renders the char as it is.
   * 4th - Break match: '\n' 
   * matches the newline charachers to render <br> elements
   */
  const parsex = /([*+_~])(.*?)(?<!\\)\1|\[(.*?)\]\((.+?)\)|\\([*+_~])|\n/g;
  const intex = /{{\s*([.\w]+)\s*}}/g;

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

    console.log(this.segments);
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
    source.replace(parsex, (match: string, style: string, content: string, anchor: string, url: string, esc: string, offset: number) => {

      // Pushes the text preceeding a match 
      if(offset > start){ 
        const content = source.substring(start, offset);
        this.segments.push({ type: "text", content });   
      }

      // Breaks
      if(match === '\n') { this.segments.push({ type: "break" }); }
      // Styled texts
      else if(style) { 

        const type = style === '*' ? 'bold' : ( style === '+' ? 'italic' : ( style === '_' ? 'underline' : 'strikethrough' ));
        this.segments.push( { type, content });
      }
      // Links
      else if(anchor) { this.segments.push({ type: "link", content: anchor, url }); }
      // Escapes
      else if(esc) { this.segments.push({ type: "text", content: esc }); }

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
    return source.replace(intex, (match, capture) => {
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
