import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wm-disclaimer',
  templateUrl: './disclaimer.component.html',
  styles: []
})
export class DisclaimerComponent {

  private segments: any[];

  constructor() { }
  
  // Classes for links/actions - works only for global defined class due to ViewEncapsulation
  // Supports the same syntax as 'ngClass'
  @Input() linkClass: string | string[] | Set<string> | {[key: string]: any};
  @Input() actionClass: string | string[] | Set<string> | {[key: string]: any};

  // Styles to apply on links/actions. Supports the same syntax as 'ngStyle'
  @Input() linkStyle: {[key: string]: string};
  @Input() actionStyle: {[key: string]: string};

  // Action event
  @Output() action = new EventEmitter<string>();

  private pushText(content: string){
    
    // Pushes the text segment into the array
    this.segments.push({
      type: "text",
      content
    });
  }

  private pushAction(code: string, content: string){
   
    // Pushes the action segment
    this.segments.push({
      type: "action",
      code,
      content
    });
  }

  // Build a link object including:
  // {
  //   link: string, // the link to jump to
  //   params?: any // the optional queryParams to pass along with the link
  // }
  //
  private pushLink(link: string, content: string) {
    
    // Check for parameters ( ex: ../jump-here?mode=set&value=max )
    let parts = link.split('?');

    // Parses the query parameters
    let params = parts.length > 1 ? this.parseLinkParams(parts[1]) : null;

    // Pushes the link segment
    this.segments.push({
      type: "link",
      link: parts[0],
      params,
      content
    });
  }

  private parseLinkParams(input: string) {

    // Match for parameter pattern
    const re = /(\w+)=(\w*)\&*/g;
    let params = {};

    // Build the parameter object
    input.replace(re, (match: string, param: string, value: string) => {

      params[param] = value;
      return '';
    });

    return params;
  }

  @Input('source') 
  set compileSegments(source: string) {

    // Matches the fields looking like <text:[@link]> where 'text' is the label to display and 'link' is the static
    // link towards the router is pointing to. When the @ flag is omitted, the mach is treated as a click action
    // instead 
    const re = /<([^<>]+):\s*\[(@)*([\w\.\-/\?\&=]+)\]\s*>/g;
    let start = 0;

    // Resets the segments array
    this.segments = [];
  
    // Uses the string.replace() parsing capabilities to evaluate the content of the input source 
    // turnint it into an array of segments (objects describing how to render the output)
    source.replace(re, (match: string, content: string, flag: string, actionOrLink: string, offset: number) => {

      // Isolate the plain text preceding the match 
      if(offset > start){
        this.pushText( source.substring(start, offset) );
      }

      // Discrimitates between click action (default) or routerLink
      if(flag == '@') {

        // Pushes the link segment
        this.pushLink(actionOrLink, content);
    
      } else {

        // Pushes the action object
        this.pushAction(actionOrLink, content);
      }
      

      // Keeps track of the next beginning for the eventual plain text between this match and the next
      start = offset + match.length;
      return "";
    });

    // Appends the final text chunk 
    if(start < source.length - 1) {
      this.pushText(source.substring(start, source.length));
    }

    console.log("disclaimer segments:");
    console.log(this.segments);
  }  
}