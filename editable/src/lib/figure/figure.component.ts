import { Component, Input, HostBinding } from '@angular/core';
import { DocumentComponent } from '../editable-document.component';
import { EditableFigure, EditableImage } from '../model/editable-figure';

@Component({
  selector: 'figure[wm-figure]',
  templateUrl: './figure.component.html',
  host: { 
    'contenteditable': 'false',
    'style': 'user-select: none' 
  }
})
export class FigureComponent {

  constructor(readonly document: DocumentComponent) {}
  
  @Input('wm-figure') figure: EditableFigure;
  // Makes sure excluding the figure container from the editability
  //@HostBinding('attr.contenteditable') editable = false;
   // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.figure && this.figure.id; }
  // Applies the requested alignement
  @HostBinding('style.text-align') get align() { return this.figure.align || 'left'; }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.selection.includes(this.figure) ? '' : undefined; 
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