import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ThemePalette } from '@angular/material/core'
import { $animations } from './menu.animations';

export interface MenuItem {

  label: string;
  link?: string;
  params?: { [param:string]: string };
  menu?: MenuItem[];
}

@Component({
  selector: 'wm-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: { 'class': 'wm-menu  background-color' },
  animations: $animations
})
export class MenuComponent {

  @ViewChildren(MatExpansionPanel) private panels: QueryList<MatExpansionPanel>;

  // Keeps the toggler undefined to ensure the very first value always goes trough
  public toggler = undefined;
  public visible = false;
  private count = 0;

  /** Menu items  */
  @Input() items: MenuItem[] = [];

  /** Active link highlighting color */
  @Input() color: ThemePalette = 'accent';

  /** Menu trogger input */
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

  /** Closes the menu with sub-menus  */
  public close() {
    // Closes all the sub panels
    this.panels?.forEach( panel => panel.close() );
    // Toggles the menu close
    this.toggleMenu = false;
  }

  public done() {
    // Skips the animation.done prior to the last one
    if(--this.count > 0) { return; }
    // Updates the visibility status
    !this.toggler && this.menuVisible.emit(this.visible = false);
  }

  /** Menu toggler output */
  @Output() togglerChange = new EventEmitter<boolean>();

  /** Menu visible output. True whenever the menu is closing but still visible */
  @Output('visible') menuVisible = new EventEmitter<boolean>();
}
