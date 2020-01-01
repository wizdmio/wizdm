import { Component, Input, HostBinding } from '@angular/core';
import { DocumentComponent } from '../editable-document.component';
import { EditableItem } from '../model/editable-item';
import { EditableCell } from '../model/editable-table';
import { EditableCaption } from '../model/editable-figure';
import { EditableInline } from '../model/editable-inline';

@Component({
  selector: '[wm-editable]',
  templateUrl: './editable.component.html',
  host: { 'style': 'white-space: pre-wrap' }
})
export class EditableComponent {

  constructor(readonly document: DocumentComponent) {}

  @Input('wm-editable') node: EditableItem|EditableCell|EditableCaption;

   @HostBinding('attr.contenteditable') get editable() { 
    return this.document.edit ? 'true' : 'false';
  }

  // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.node && this.node.id; }
  
  // Applies text align style according to node alignement
  @HostBinding('style.text-align') get align() { return !!this.node && this.node.align; }
  
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.selection.includes(this.node) ? '' : undefined; 
  }

  // Helper function computing the max-size style for images
  /*
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
  }*/

  // Helper function computing the text node style
  style(text: EditableInline): any {

    return !!text && text.style.reduce( (style, add) => {

      switch(add) {
        case 'bold': 
        style['font-weight'] = '700'; 
        break;
        
        case 'italic': 
        style['font-style'] = 'italic';
        break;

        case 'underline':
        style['text-decoration'] = 'underline';
        break;

        case 'overline':
        style['text-decoration'] = 'overline';
        break;

        case 'strikethrough':
        style['text-decoration'] = 'line-through';
        break;

        case 'super':
        style['vertical-align'] = 'super';
        style['font-size'] = '70%';
        break;
    
        case 'sub': 
        style['vertical-align'] = 'sub';
        style['font-size'] = '60%';
        break;
      }

      return style;

    },{});
  }

  navigate(url: string): boolean {

    // Reverts to the parent document navigation event 
    this.document.navigate.emit(url);
    // Prevents the default behavior, so, [href] can be filled in for both clarity and debug purposes
    return false;
  }
}