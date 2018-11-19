import { Component, Input } from '@angular/core';

@Component({
  selector: 'wm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  // Navigation menu items (links)
  @Input() menuItems: any[] = [];

  constructor() {}
}
