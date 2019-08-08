import { EditableContent } from './editable-content';
import { wmDocument, wmNodeType } from './editable-types';

export class EditableDocument extends EditableContent<wmDocument> {
  // Makes sure always returning the appropiate type since EditableDoc is the default node type
  get type(): wmNodeType { return 'document'; }
  get range(): [number, number] { return this.data.range; }

  public setRange(start: number, end: number): this {
    this.data.range = [start, end];
    return this;
  }

  /** Creates a new empty document */
  public new(info?: { title?: string, author?: string, version?: string }): this {
    // Creates a new tree made of a document containing 
    // a single paragraph with a signle empty text node
    return this.load({ ...info,
      type: 'document', content: [{ 
        type: 'paragraph', content: [{ 
          type: 'text', value: '' 
    }]}]} as any) as this;
  }
}
