import { Component, HostBinding, HostListener } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'wm-context-menu',
  template: '<ng-content></ng-content>',
  styles: ['']
})
export class ContextMenuComponent extends MatMenuTrigger {
  @HostBinding('style.position') private position = 'fixed';
  //@HostBinding('style.pointer-events') private events = 'none';
  @HostBinding('style.left') private x: string;
  @HostBinding('style.top') private y: string;

  // Intercepts the global context menu event
  @HostListener('document:contextmenu', ['$event'])
  menuContext(ev: MouseEvent) {
    // Closes the menu when already opened
    if (this.menuOpen) {
      this.closeMenu();
    } else {
      // Adjust the menu anchor position
      this.x = ev.clientX + 'px';
      this.y = ev.clientY + 'px';

      // Opens the menu
      this.openMenu();
    }
    // prevents default
    return false;
  }
}
