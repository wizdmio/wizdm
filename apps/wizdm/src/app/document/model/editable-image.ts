import { EditableContent } from './editable-content';
//import { EditableText } from './editable-text';
import { wmImage, wmText } from './editable-types';

export class EditableImage extends EditableContent<wmImage> {
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