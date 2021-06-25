import { EditableDocumentData, EditableFigureData, EditableImageData } from '@wizdm/editable';
import { Directive, Input, HostBinding, OnChanges } from '@angular/core';

/** An image preview from the given editable document */
@Directive({
  selector: 'img[wm-editable-image]'
})
export class PreviewImageDirective implements OnChanges {

  /** Source editable document */
  @Input('wm-editable-image') document: EditableDocumentData;

  /** Image index, default to 1 (the very first image) */
  @Input() index: number = 1;

  @HostBinding('src') source: string;
  
  @HostBinding() alt: string;

  @HostBinding() title: string;

  ngOnChanges() {

    // Initializes the counter
    let count = this.index;

    // Seeks for the document figure matching the given index
    const figure = this.document.content?.find(el => el.type === 'figure' && --count === 0) as EditableFigureData;

    // Extracts the image, if any
    const image = figure.content?.find(el => el.type === 'image') as EditableImageData;

    // Applies the erlevant attributes to the host image
    this.source = image?.url || undefined;

    this.title = image?.title || '';

    this.alt = image?.alt || '';
  }
}
