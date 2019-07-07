import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ToolbarService, wmAction } from './toolbar/toolbar.service';
import { ViewportService } from './viewport/viewport.service';
import { notifyMsg, notifyType } from './notify/notify.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
export { wmAction };

@Injectable()
export class NavigatorService {

  // Global error stream
  readonly notification$: Observable<notifyMsg>;
  private notify$: BehaviorSubject<notifyMsg>;

  constructor(readonly media    : MediaObserver,
              readonly toolbar  : ToolbarService, 
              readonly viewport : ViewportService) {

    this.notify$ = new BehaviorSubject<any>(null);
    // Maps the error stream asynchronously. This is a trick to ensure navigator view
    // updates consistently although children pages are responsible for error reporting
    // (so preventing ExpressionChangedAfterItHasBeenCheckedError to occur)
    this.notification$ = this.notify$.pipe( delay(0),  );
  }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

  // Global message notification helper
  public notifyMessage(msgOrError: string|Error, type: notifyType = 'error'): void { 
    this.notify$.next({ type, message: (msgOrError as any).code || msgOrError }); 
  }

  public clearMessage(): void { this.notify$.next(null); }
}
