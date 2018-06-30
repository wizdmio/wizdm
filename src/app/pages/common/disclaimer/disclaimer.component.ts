import { Component, Input } from '@angular/core';

@Component({
  selector: 'wm-disclaimer',
  templateUrl: './disclaimer.component.html',
  styles: []
})
export class DisclaimerComponent {

  private segments: any[];

  constructor() { }

  @Input() linkClass = "";

  @Input('source') 
  set compileSegments(source: string) {

    // Matches the fields looking like <text:[link]> where 'text' is the label to display and 'link' is the static
    // link towards the router is pointing to
    const re = /<([\w\s]+):\s*\[([\w\.\-/]+)\]\s*>/g;
    let start = 0;

    // Resets the segments array
    this.segments = [];
  
    // Uses the string.replace() parsing capabilities to evaluate the content of the input source 
    // turnint it into an array of segments (objects describing how to render the output)
    source.replace(re, (match: string, content: string, link: string, offset: number) => {

      // Isolate the plain text preceding the match 
      if(offset > start){

        // Pushes the text segment into the array
        this.segments.push({
          type: "text",
          content: source.substring(start, offset)
        });
      }

      // Pushes the link segment that matched into the array 
      this.segments.push({
        type: "link",
        content: content,
        link: link
      });

      // Keeps track of the next beginning for the eventual plain text between this match and the next
      start = offset + match.length;
      return "";
    });

    // Appends the final text chunk 
    if(start < source.length - 1){
       this.segments.push({
          type: "text",
          content: source.substring(start, source.length)
        });
    }

    console.log("disclaimer segments:");
    console.log(this.segments);
  } 
}