import { EditableContent } from './editable-content';
import { wmImage } from './editable-types';

export class EditableImage extends EditableContent<wmImage> {

  get size(): string { return this.data.size || ''; }
  get url(): string { return this.data.url; }
  get title(): string|undefined  { return this.data.title || ''; }
  get alt(): string|undefined { return this.data.alt || ''; }
}
