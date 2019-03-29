import { EditableContent } from './editable-content';
import { wmFrame, wmImage } from './editable-types';

export class EditableFrame extends EditableContent<wmFrame> {}
export class EditableImage extends EditableContent<wmImage> {

  get url(): string { return this.data.url; }
  get title(): string { return this.data.title || ''; }
  get alt(): string { return this.data.alt || ''; }

/*
  // Forces the image content to be a single empty text node 
  protected children: EditableContent[] = [
    new TextLikeHelper(this.create,{ type: 'text'}).inherit()
  ];

  // Overrides with image specifics
  //get pad(): string { return ''; }*/
}
/*
class TextLikeHelper extends EditableContent<wmText> {

  public cut(till: number, from?: number): string {
    this.container.remove();
    return ''; 
  }
}*/