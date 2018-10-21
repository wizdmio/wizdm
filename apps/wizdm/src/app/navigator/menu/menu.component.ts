import { Component, Input, HostBinding } from '@angular/core';
import { $animations } from './menu.animations';

@Component({
  selector: 'wm-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: $animations
})
export class MenuComponent {

  @HostBinding('@menu') menuTrigger = true;

  constructor() { }

  @Input() menuItems: any[] = [];
}
