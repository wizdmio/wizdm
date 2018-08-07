import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type toolbarAction = {
  caption: string,
  code?: string,
  link?: string,
  params?: any
};

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  
  private actionButtons: toolbarAction[] = [];
  private actionsEvent: Subject<string>;
  
  constructor() { }

  get buttons(): toolbarAction[] {
    return this.actionButtons;
  }

  public clearActions() {

    if(this.actionsEvent) {
      this.actionsEvent.complete();
    }

    this.actionButtons = [];
  }

  public activateActions(buttons: toolbarAction[]): Observable<string> {

    this.clearActions();
    
    this.actionButtons.push(...buttons);

    return this.actionsEvent = new Subject();
  }

  public performAction(code: string) {
    this.actionsEvent.next(code);
  }
}
