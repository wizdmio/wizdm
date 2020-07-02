import { wmContainer, wmAlignable, wmAlignType } from './editable-types';
import { EditableContent } from './editable-content';

export class EditableContainer<T extends wmContainer = wmContainer> extends EditableContent<T> {

  /** Sets/gets the container alignement */
  get align(): wmAlignType { return (this.node as wmAlignable).align || 'left'; }
  set align(align: wmAlignType) { (this.node as wmAlignable).align = align; }
 
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