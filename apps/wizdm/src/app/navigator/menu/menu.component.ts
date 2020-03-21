import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { $animations } from './menu.animations';

@Component({
  selector: 'wm-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: { 'class': 'wm-menu  background-color' },
  animations: $animations
})
export class MenuComponent {

  // Keeps the toggler undefined to ensure the very first value always goes trough
  public toggler = undefined;
  public visible = false;
  private count = 0;

  @Input() items: any[] = [];

  @Input('toggler') set toggleMenu(toggler: boolean) {
    // Skips meaningless changes to avoid looping on double binding
    if(toggler === this.toggler) { return; }
    // Updates the menu toggle status
    this.togglerChange.emit(this.toggler = toggler);
    // Updates the menu visibility status
    this.toggler && this.menuVisible.emit(this.visible = true);
    // Keeps track of the toggle hits
    this.count++;
  }

  public done() {
    // Skips the animation.done prior to the last one
    if(--this.count > 0) { return; }
    // Updates the visibility status
    !this.toggler && this.menuVisible.emit(this.visible = false);
  }

  @Output() togglerChange = new EventEmitter<boolean>();

  @Output('visible') menuVisible = new EventEmitter<boolean>();
}
