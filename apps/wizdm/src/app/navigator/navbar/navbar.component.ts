import { Component, Input } from '@angular/core';
import { $animations } from './navbar.animations';

@Component({
  selector: 'wm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: $animations
})
export class NavbarComponent {

  // Navigation menu items (links)
  @Input() menuItems: any[] = [];
}
