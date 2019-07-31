import { EditableContent } from './editable-content';
import { wmFigure, wmImage, wmCaption } from './editable-types';

export class EditableFigure extends EditableContent<wmFigure> {

  // Overrides the default setter redirecting to the child caption node 
  public set(text: string): this {

    ( this.content.find( node => node.type === 'caption' ) || this.appendChild(this.create.caption) ).set(text);
    // Return this for chaining
    return this;   
  }

  // Overrides the default linker redirecting to the child image node
  public link(url: string): this { 

    ( this.content.find( node => node.type === 'image' ) || this.appendChild(this.create.image) ).link(url);
    // Return this for chaining
    return this;     
  }
}

export class EditableImage extends EditableContent<wmImage> {

  // Overridnes the default value
  get pad(): string { return ''; }

  // Implements image specifics
  get url(): string { return this.data.url || ''; }
  get title(): string|undefined  { return this.data.title || ''; }
  get alt(): string|undefined { return this.data.alt || ''; }
  get size(): string { return this.data.size || ''; }
  
  /** Links the image to its source */
  public link(url: string): this { return this.data.url = url, this ;}
}

export class EditableCaption extends EditableContent<wmCaption> {
 
  // Overrides the default setter forcing a single node value 
  public set(text: string): this {
    // Wipes text nodes exceeding the first
    if(this.count > 1) { this.splice(1, -1); }
    // Updates the first node value
    if(this.count > 0) { this.firstChild().value = text };
    // Insert a text node when missing
    if(this.count === 0) { this.appendChild( this.create.text.set(text) ); };
    // Return this for chaining
    return this; 
  }
}
