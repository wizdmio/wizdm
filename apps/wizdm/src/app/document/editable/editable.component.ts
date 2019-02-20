import { Component, Input, HostBinding } from '@angular/core';
import { EditableContent, EditableText } from '../common/editable-content';

@Component({
  selector: '[wm-editable]',
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.scss']
})
export class EditableComponent {

  @Input('wm-editable') node: EditableContent;
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

  style(node: EditableText): any {

    return !!node && node.style.reduce( (obj, style) => {

      switch(style) {
        case 'bold': 
        obj['font-weight'] = '700'; 
        break;
        
        case 'italic': 
        obj['font-style'] = 'italic';
        break;

        case 'underline':
        obj['text-decoration'] = 'underline';
        break;

        case 'overline':
        obj['text-decoration'] = 'overline';
        break;

        case 'strikethrough':
        obj['text-decoration'] = 'line-through';
        break;

        case 'super':
        obj['vertical-align'] = 'super';
        obj['font-size'] = '70%';
        break;
    
        case 'sub': 
        obj['vertical-align'] = 'sub';
        obj['font-size'] = '60%';
        break;
      }

      return obj;
    }, {});
  }
}