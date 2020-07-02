import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { $animations } from './navbar.animations';

export interface MenuItem {

  label: string;
  link?: string;
  params?: { [param:string]: string };
  menu?: MenuItem[];
}

@Component({
  selector: 'wm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  host: { 'class': 'wm-navbar' },
  encapsulation: ViewEncapsulation.None,
  animations: $animations
})
export class NavbarComponent {

  /** Navigation menu items (links) */
  @Input() menuItems: MenuItem[] = [];

  /** Active links highlighting color */
  @Input() color: ThemePalette = 'accent';

}
