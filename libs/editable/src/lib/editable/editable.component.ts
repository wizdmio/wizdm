import { Component, Input, HostBinding } from '@angular/core';
import { EditableItem, EditableCell, EditableText, EditableImage } from '../model';
import { EditableSelection } from '../selection/editable-selection.service';
import { EditableDocument } from '../editable-document.component';

@Component({
  selector: '[wm-editable]',
  templateUrl: './editable.component.html'
})
export class EditableComponent {

  constructor(readonly document: EditableDocument, private sel: EditableSelection) {}

  @Input('wm-editable') node: EditableItem | EditableCell;
  // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.node && this.node.id; }
  // Applies text align style according to node alignement
  @HostBinding('style.text-align') get align() { return !!this.node && this.node.align; }
  // Applies material typography classes based on node level
  @HostBinding('class.mat-h1') get h1() { return !!this.node && this.node.level === 1; }
  @HostBinding('class.mat-h2') get h2() { return !!this.node && this.node.level === 2; }
  @HostBinding('class.mat-h3') get h3() { return !!this.node && this.node.level === 3; }
  @HostBinding('class.mat-h4') get h4() { return !!this.node && this.node.level === 4; }
  @HostBinding('class.mat-h5') get h5() { return !!this.node && this.node.level === 5; }
  @HostBinding('class.mat-h6') get h6() { return !!this.node && this.node.level === 6; }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { return this.sel.selected(this.node) ? '' : undefined; }

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

  // Helper function computing the text node style
  style(text: EditableText): any {

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
    }, 
    { // Default styles
      'font-weight': 'unset',
      'font-style': 'unset',
      'text-decoration': 'unset',
      'vertical-align': 'unset',
      'white-space': 'pre-wrap'
    });
  }

  navigate(url: string): boolean {

    // Reverts to the parent document navigation event 
    this.document.navigate.emit(url);
    // Prevents the default behavior, so, [href] can be filled in for both clarity and debug purposes
    return false;
  }
}