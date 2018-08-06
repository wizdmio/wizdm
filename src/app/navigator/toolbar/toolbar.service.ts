import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
  private actionsEvent: Subject<string> = new Subject();
  private disposeActions$: Subject<void> = new Subject();

  constructor() { }

  get buttons(): toolbarAction[] {
    return this.actionButtons;
  }

  public activateActions(buttons: toolbarAction[]): Observable<string> {

    if(this.actionButtons.length) {
      this.clearActions();
    }

    this.actionButtons.push(...buttons);

    return this.actionsEvent.pipe( takeUntil(this.disposeActions$) );
  }

  public performAction(code: string) {
    this.actionsEvent.next(code);
  }

  public clearActions() {
    this.actionButtons = [];
    this.disposeActions$.next();
    this.disposeActions$.complete();
  }
}
