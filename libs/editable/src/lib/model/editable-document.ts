import { EditableContent } from './editable-content';
import { wmDocument } from './editable-types';

export class EditableDoc extends EditableContent<wmDocument> {
  
  /** Creates a new empty document */
  public new(info?: { title?: string, author?: string, version?: string }): this {
    // Creates a new tree made of a document containing 
    // a single paragraph with a signle empty text node
    return this.load({ ...info,
      type: 'document', content: [{ 
        type: 'item', content: [{ 
          type: 'text', value: '' 
    }]}]} as any) as this;
  }
}