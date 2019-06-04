import { EditableContent } from './editable-content';
import { wmImage, wmAlignType } from './editable-types';

export class EditableImage extends EditableContent<wmImage> {
  // Overrides with text node specifics
  //get pad(): string { return ''; }
  get empty(): boolean { return !!this.url; }
  // Redirects to the parent container
  set align(align: wmAlignType) { if(!!this.parent) { this.parent.align = align; } }
  get align(): wmAlignType { return !!this.parent ? this.parent.align : 'left'; }
  // Do nothing
  set level(level: number) { /* Do nothing  */ }
  get level(): number { return 0; }
  // Overrides the base class setter
  public set(text: string): this { return (this.data.url = text), this; }
  // Implements image specifics
  get size(): string { return this.data.size || ''; }
  get url(): string { return this.data.url; }
  get title(): string|undefined  { return this.data.title || ''; }
  get alt(): string|undefined { return this.data.alt || ''; }
}