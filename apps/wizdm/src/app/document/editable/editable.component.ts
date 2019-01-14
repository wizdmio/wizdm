import { Component, Input, HostBinding, HostListener, ElementRef  } from '@angular/core';
import { EditableContent } from '../common/editable-content';

@Component({
  selector: '[wm-editable]',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class EditableComponent {

  constructor() {}

  node: EditableContent;
  
  @Input('wm-editable') set source(node: EditableContent) {
    // Updates the node deferring descendants
    this.node = node.update(true);
  }

  @Input() edit = true;

  @HostBinding('id') get id() {
    return this.node.id;
  }

  @HostBinding('style.text-align') get align() {
    return this.node && this.node.align;
  }
}