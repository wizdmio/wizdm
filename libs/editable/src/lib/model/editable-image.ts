import { EditableContent } from './editable-content';
import { wmImage } from './editable-types';

export class EditableImage extends EditableContent<wmImage> {
  // Overrides with image node specifics
  //get value(): string { return this.node.value || ''; }
  //set value(text: string) { this.node.value = text; }
  //get empty(): boolean { return this.length <= 0;}
  // Do nothing
  //set level(level: number) { /* Do nothing  */ }
  //get level(): number { return 0; }
  // Implements image specifics
  get url(): string { return this.data.url || ''; }
  get title(): string|undefined  { return this.data.title || ''; }
  get alt(): string|undefined { return this.data.alt || ''; }
  get size(): string { return this.data.size || ''; }
  
  /** Links the image to its source */
  public link(url: string): this { return this.data.url = url, this ;}

  // Overrides the default setter forcing a single node value 
  public set(text: string): this {
    // Wipes text nodes exceeding the fist
    if(this.count > 1) { this.splice(1, -1); }
    // Updates the first node value
    if(this.count > 0) { this.firstChild().value = text };
    // Insert a text node when missing
    if(this.count === 0) { this.appendChild( this.create.text.set(text) ); };
    // Return this for chaining
    return this; 
  }
}