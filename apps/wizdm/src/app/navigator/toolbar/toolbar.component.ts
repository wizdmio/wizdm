import { Component } from '@angular/core';
import { ToolbarService, wmAction } from './toolbar.service';
import { $animations } from './toolbar-animations';

@Component({
  selector: 'wm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: $animations
})
export class ToolbarComponent {

  constructor(private service: ToolbarService) {}

  public get actionButtons(): wmAction[] {
    return this.service.buttons;
  }

  public get someAction() {
    return this.service.someAction;
  }

  public clearActions(): void {
    this.service.clearActions();
  }

  public performAction(code: string): void {
    this.service.performAction(code);
  }
}
