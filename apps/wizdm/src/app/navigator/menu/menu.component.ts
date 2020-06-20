import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ViewChildren, QueryList } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core';
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

  /** The sub-menu panels */
  @ViewChildren(MatExpansionPanel) private panels: QueryList<MatExpansionPanel>;

  // Activates the main animation by the toggler
  @HostBinding('@menu') get trigger() { return !!this.toggler; }

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
    // Gets the proper boolean value
    toggler = coerceBooleanProperty(toggler);
    // Skips meaningless values to avoid looping on double binding
    if(toggler === this.toggler) { return; }
    // Updates the menu toggle status
    this.togglerChange.emit(this.toggler = toggler);
    // Updates the menu visibility status
    this.toggler && this.menuVisible.emit(this.visible = true);
    // Keeps track of the toggle hits
    this.count++;
  }

  // Stops the click event from bubbling up to the parent. This helps to 
  // implement a general close on click by the container
  @HostListener('click', ['$event']) preventBubbling(event: MouseEvent) {
    event.stopPropagation();
  }

  /** Closes the menu with sub-menus  */
  public close() {
    // Closes all the sub panels
    this.panels?.forEach( panel => panel.close() );
    // Toggles the menu close
    this.toggleMenu = false;
  }

  // Reacts to the animation completion
  @HostListener('@menu.done') public done() {
    // Skips the animation.done prior to the last one
    if(this.count < 0 || --this.count > 0) { return; }
    // Updates the visibility status
    !this.toggler && this.menuVisible.emit(this.visible = false);
  }

  /** Menu toggler output */
  @Output() togglerChange = new EventEmitter<boolean>();

  /** Menu visible output. True whenever the menu is closing but still visible */
  @Output('visible') menuVisible = new EventEmitter<boolean>();
}
