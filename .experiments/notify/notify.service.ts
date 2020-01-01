import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export type notifyType = 'info'|'error';

export interface notifyMsg {
  type    : notifyType,
  message : string
};

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  readonly notification$: Observable<notifyMsg>;
  private notify$: BehaviorSubject<notifyMsg>;

  constructor() {

    this.notify$ = new BehaviorSubject<notifyMsg>(null);
    // Maps the error stream asynchronously. This is a trick to ensure navigator view
    // updates consistently although children pages are responsible for error reporting
    // (so preventing ExpressionChangedAfterItHasBeenCheckedError to occur)
    this.notification$ = this.notify$.pipe( delay(0) );
   }

   // Global message notification helper
  public notify(msgOrError: string|Error, type: notifyType = 'error'): void { 

    this.notify$.next({ type, message: (msgOrError as any).code || msgOrError }); 
  }

  public clear(): void { this.notify$.next(null); }
}
