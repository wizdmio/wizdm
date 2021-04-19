import { EditableContainer } from './editable-container';
import { EditableItemData, EditableHeadingData, EditableSizeLevel } from './editable-types';

export class EditableItem extends EditableContainer<EditableItemData> {

   /** Sets/gets the container level */
  get level(): EditableSizeLevel { return (this.data as EditableHeadingData).level || 0; }
  set level(level: EditableSizeLevel) {
    // Whenever the level is within heading values...
    if(level >= 1 && level <= 6) {
      // Turn paragraphs into headings when needed
      if(this.type === 'paragraph') { this.data.type = 'heading'; }
      // Applies the new heading level
      if(this.type === 'heading') { (this.data as any).level = level; }
    }
    // Turns headings to paragraphs otherwise
    else if(level === 0 && this.type === 'heading') {
      this.data.type = 'paragraph';
      delete (this.data as EditableHeadingData).level;
    }
  }
}