import { Component, Input } from '@angular/core';
import { $animations } from './navbar.animations';

export interface MenuItem {

  label: string;
  link?: string;
  menu?: MenuItem[];
}

@Component({
  selector: 'wm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  host: { 'class': 'wm-navbar' },
  animations: $animations
})
export class NavbarComponent {

  // Navigation menu items (links)
  @Input() menuItems: MenuItem[] = [];
}
