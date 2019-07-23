import { Component, Input, Output, EventEmitter } from '@angular/core';
import { wmAction } from '../toolbar.service'; 
import { $animations } from './action.animations';

@Component({
  selector: 'wm-toolbar-action',
  templateUrl: './action.component.html',
  animations: $animations
})
export class ActionComponent {

  constructor() { }

  @Input() action: wmAction;

  // Emits when action is activated
  @Output() activate = new EventEmitter<string>();

  // Set to true to render a menu item
  @Input() menu = false;
}
