import { Component, Input, HostBinding } from '@angular/core';
import { DocumentViewer } from '../editable-viewer.component';
import { EditableItem } from '../model/editable-item';
import { EditableCell } from '../model/editable-table';
import { EditableCaption } from '../model/editable-figure';
import { EditableInline } from '../model/editable-inline';

/** Inline Elements' custom classes */
export interface EditableInlineCustomClasses {
  a? : string;
}

@Component({
  selector: '[wm-editable]',
  templateUrl: './editable.component.html',
  host: { 'style': 'white-space: pre-wrap' }
})
export class EditableComponent {

  constructor(readonly document: DocumentViewer) {}

  /** Input Node */
  @Input('wm-editable') node: EditableItem|EditableCell|EditableCaption;

  /** Rendered elements' custom classes */
  @Input() customClasses: EditableInlineCustomClasses;

  // Applies the conteneditable attribute while in editMode
  @HostBinding('attr.contenteditable') get editable() { 
    return this.document.edit ? 'true' : undefined;
  }

  // Applies the empty class
  @HostBinding('class.empty') get empty() { 
    return !!this.node && this.node.empty; 
  }

  // Applies the node id to the element
  @HostBinding('id') get id() { 
    return !!this.node && this.node.id; 
  }
  
  // Applies text align style according to node alignement
  @HostBinding('style.text-align') get align() { 
    return !!this.node && this.node.align; 
  }
  
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.isSelected(this.node) ? '' : undefined; 
  }

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