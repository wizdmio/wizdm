import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { ContentManager } from '@wizdm/content';
import { $animations } from './menu.animations';

@Component({
  selector: 'wm-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: $animations
})
export class MenuComponent {

  public menu;

  constructor(private content: ContentManager) { 

    // Gets the localized menu content
    this.menu = this.content.select("navigator.menu");
  }

  @Input() signedIn: boolean = false;

  public get menuItems() {
    return this.signedIn ? this.menu.private : this.menu.public;
  }

  @HostBinding('@menu') menuTrigger = false;

  @HostListener('@menu.done') menuDone() {
    this.menuClosed = !this.menuTrigger;
  }

  public menuClosed = true;
}
