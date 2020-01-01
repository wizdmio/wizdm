import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { $animations } from './menu.animations';

@Component({
  selector: 'wm-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: { 'class': 'wm-menu' },
  animations: $animations
})
export class MenuComponent {

  public toggler = false;
  public visible = false;

  @Input() items: any[] = [];

  @Input('toggler') set toggleMenu(toggler: boolean) {

    this.togglerChange.emit(this.toggler = toggler);
    
    this.toggler && this.menuVisible.emit(this.visible = true);
  }

  public done() {

    !this.toggler && this.menuVisible.emit(this.visible = false);
  }

  @Output() togglerChange = new EventEmitter<boolean>();

  @Output('visible') menuVisible = new EventEmitter<boolean>();
}
