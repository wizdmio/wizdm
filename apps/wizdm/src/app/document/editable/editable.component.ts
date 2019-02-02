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

    const style = {};

    if(!!node && node.bold) {
      style['font-weight'] = '700';
    }

    if(!!node && node.italic) {
      style['font-style'] = 'italic';
    }

    if(!!node && node.underline) {
      style['text-decoration'] = 'underline';
    }

    if(!!node && node.overline) {
      style['text-decoration'] = 'overline';
    }

    if(!!node && node.strikethrough) {
      style['text-decoration'] = 'line-through';
    }

    if(!!node && node.superScript) {
      style['vertical-align'] = 'super';
      style['font-size'] = '70%';
    }

    if(!!node && node.subScript) {
      style['vertical-align'] = 'sub';
      style['font-size'] = '60%';
    }

    return style;
  }
}