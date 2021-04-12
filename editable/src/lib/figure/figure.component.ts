import { Component, Input, HostBinding } from '@angular/core';
import { EditableFigure, EditableImage } from '../model/editable-figure';
import { DocumentViewer } from '../editable-viewer.component';

/** Inline Elements' custom classes */
export interface EditableFigureCustomClasses {
  img?     : string;
  table?   : string;
  caption? : string; 
}

/** Figure Node Renderer */
@Component({
  selector: 'figure[wm-figure]',
  templateUrl: './figure.component.html',
  host: { 
    'contenteditable': 'false',
    'style': 'user-select: none' 
  }
})
export class FigureComponent {

  constructor(readonly document: DocumentViewer) {}
  
  /** Input Node */
  @Input('wm-figure') figure: EditableFigure;

  /** Rendered elements' custom classes */
  @Input() customClasses: EditableFigureCustomClasses;

  // Applies the node id to the element
  @HostBinding('id') get id() { 
    return !!this.figure && this.figure.id; 
  }
  
  // Applies the requested alignement
  @HostBinding('style.text-align') get align() { 
    return this.figure.align || 'left'; 
  }
  
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.isSelected(this.figure) ? '' : undefined; 
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