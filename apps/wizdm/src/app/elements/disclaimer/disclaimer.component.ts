import { Component, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'

export interface DisclaimerLink {

  type    : 'link';
  content : string;
  url     : string;
  target  : string; 
  params  : { [key: string]: string }; 
}

export interface DisclaimerText {

  type    : 'text';
  content : string;
}

export type DisclaimerSegment = DisclaimerText|DisclaimerLink;

@Component({
  selector: '[wm-disclaimer]',
  templateUrl: './disclaimer.component.html',
  host: { 'class': 'wm-disclaimer' }
})
export class DisclaimerComponent {

  public segments: DisclaimerSegment[];

  @Input() color: ThemePalette;

  @Input('disabled') set disabling(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false;

  // Source input
  @Input('wm-disclaimer') set compileSegments(source: string) {

    // Matches the markdown-like links looking like [text](url) where 'text' is the label to display and 'url' is the target to navigate to.
    const re = /\[([^\[\]]*)\]\(([^\(\)]+)\)/g;
    let start = 0;
    // Resets the segments array
    this.segments = [];
    // Uses the string.replace() parsing capabilities to evaluate the content of the input source 
    // turnint it into an array of segments (objects describing how to render the output)
    source.replace(re, (match: string, content: string, url: string, offset: number) => {
      // Pushes the plain text preceeding the match 
      if(offset > start){ this.pushText( source.substring(start, offset) );}
      // Pushes the matched link
      if(!!url) { this.pushLink(url, content);}
      // Keeps track of the next beginning for the eventual plain text between this match and the next
      start = offset + match.length;
      return "";
    });

    // Appends the final text chunk 
    if(start < source.length - 1) {
      this.pushText(source.substring(start, source.length));
    }
  } 

  // Action event
  @Output('navigate') nav = new EventEmitter<DisclaimerLink>();

  public navigate(to: DisclaimerLink) {
    return this.nav.emit(to), false; // Prevents default
  }

  private pushText(content: string){
    // Pushes the text segment into the array
    this.segments.push({
      type: "text",
      content
    });
  }

  private pushLink(url: string, content: string) {
    // Check for parameters ( ex: ../jump-here?mode=set&value=max )
    const parts = url.split('?');
    // Parses the query parameters
    const params = parts.length > 1 ? this.parseParams(parts[1]) : undefined;
    // Pushes the link segment
    this.segments.push({
      type: "link",
      target: parts[0],
      params,
      content,
      url
    });
  }

  private parseParams(input: string) {
    // Match for parameter pattern
    const re = /(\w+)=(\w*)\&*/g;
    const params = {};
    // Build the parameter object
    input.replace(re, (match: string, param: string, value: string) => {

      params[param] = value;
      return '';
    });

    return params;
  }
}