import { EditableContent } from './editable-content';
import { EditableContainer } from './editable-container';
import { wmFigure, wmImage, wmCaption, wmAlignType, wmAlignable } from './editable-types';

export class EditableFigure extends EditableContent<wmFigure> {

  /** Sets/gets the container alignement */
  get align(): wmAlignType { return (this.node as wmAlignable).align || 'left'; }
  set align(align: wmAlignType) { (this.node as wmAlignable).align = align; }

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

export class EditableCaption extends EditableContainer<wmCaption> { }
