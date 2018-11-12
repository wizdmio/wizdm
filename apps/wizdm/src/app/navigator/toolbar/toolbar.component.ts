import { Component, Input } from '@angular/core';
import { ToolbarService, wmAction } from './toolbar.service';
import { $animations } from './toolbar-animations';
import { Observable } from 'rxjs';
//import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'wm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: $animations
})
export class ToolbarComponent {

  @Input() buttons: wmAction[];

  constructor(readonly service: ToolbarService) {}
/*
  public get actionButtons(): Observable<wmAction[]> {
    return this.service.buttons$;
  }

  public get someAction(): Observable<boolean> {
    return this.service.some$;
  }
*/
  public clearActions(): void {
    this.service.clearActions();
  }

  public performAction(code: string): void {
    this.service.performAction(code);
  }
}
