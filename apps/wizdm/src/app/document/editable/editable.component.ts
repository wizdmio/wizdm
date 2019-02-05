import { Component, Input, HostBinding } from '@angular/core';
import { EditableText } from '../common/editable-content';

@Component({
  selector: '[wm-editable]',
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.scss']
})
export class EditableComponent {

  @Input('wm-editable') node: EditableText;

  @HostBinding('id') get id() {
    return !!this.node && this.node.id;
  }

  @HostBinding('style.text-align') get align() {
    return !!this.node && this.node.align;
  }

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