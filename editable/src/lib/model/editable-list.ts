import { EditableContent } from './editable-content';
import { EditableListData, EditableNumberedData } from './editable-types';

/** Implements list nodes */
export class EditableList extends EditableContent<EditableListData> {

  get start(): number { 
    return this.type === 'numbered' ? (this.data as EditableNumberedData).start : 0; 
  }
}
