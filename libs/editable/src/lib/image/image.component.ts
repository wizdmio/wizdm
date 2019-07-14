import { Component, Input, HostBinding } from '@angular/core';
import { EditableDocument } from '../editable-document.component';
import { EditableImage } from '../model/editable-image';

@Component({
  selector: 'figure[wm-image]',
  templateUrl: './image.component.html',
  /*host: { 
    'contenteditable': 'false',
    'user-select:'   : 'none'
  }*/
})
export class ImageComponent {

  constructor(readonly document: EditableDocument) {}
  
  @Input('wm-image') image: EditableImage;
   // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.image && this.image.id; }
  // Applies the requested alignement
  @HostBinding('style.text-align') get align() { return this.image.align || 'left'; }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.selection.includes(this.image) ? '' : undefined; 
  }

  // Helper function computing the max-size style for images
  size(img: EditableImage): string {

    switch(!!img && img.size) { 

      case '25': case '33': case '50': case '66': case '75':
      return `${img.size}%`;
      
      case 'icon':
      return '48px';

      case 'thumb':
      return '150px';

      case 'small':
      return '400px';

      case 'regular':
      return '1024px';
    }

    return '100%';
  }
}