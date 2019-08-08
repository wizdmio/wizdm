import { EditableContent } from './editable-content';
import { wmList, wmNumbered } from './editable-types';

/** Implements list nodes */
export class EditableList extends EditableContent<wmList> {

  get start(): number { 
    return this.type === 'numbered' ? (this.data as wmNumbered).start : 0; 
  }
}
