import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wm-disclaimer',
  templateUrl: './disclaimer.component.html',
  styles: []
})
export class DisclaimerComponent {

  private segments: any[];

  constructor() { }

  @Output() action = new EventEmitter<string>();
  @Input() linkClass = "";
  @Input() actionClass = "";

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

    // No parameter ? Returns a plane link
    if (parts.length > 1) {
      
      // Match for parameter pattern
      const re = /(\w+)=(\w*)\&*/g;
      let params = {};

      // Build the parameter object
      parts[1].replace(re, (match: string, param: string, value: string) => {

        params[param] = value;
        return '';
      });

      // Pushes the link segment
      this.segments.push({
        type: "link",
        link: parts[0],
        params,
        content
      });
    }
    else {

      // Pushes a plain link object
      this.segments.push({ 
        link: parts[0], 
        content
      });
    }
  }

  @Input('source') 
  set compileSegments(source: string) {

    // Matches the fields looking like <text:[link]> where 'text' is the label to display and 'link' is the static
    // link towards the router is pointing to
    const re = /<([\w\.\s]+):\s*\[(@)*([\w\.\-/\?\&=]+)\]\s*>/g;
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