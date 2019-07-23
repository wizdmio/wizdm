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

  @Input() menuItems: any[] = [];

  public toggle = false;
  public visible = false;

  constructor() { }

  @Output('visible') menuVisible = new EventEmitter<boolean>();
  
  @Input('toggle') set menuShow(toggle: boolean) {
    
    if(this.toggle = toggle) {
      this.menuVisible.emit(this.visible = true);
    }
  }

  public menuDone() {
    if(!this.toggle) {
      this.menuVisible.emit(this.visible = false);
    }
  }
}
