import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ToolbarService, wmAction } from './toolbar/toolbar.service';
import { ViewportService } from './viewport/viewport.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
export { wmAction };

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  // Global error stream
  private _error$: BehaviorSubject<any>;
  readonly error$: Observable<any>;

  constructor(readonly media    : MediaObserver,
              readonly toolbar  : ToolbarService, 
              readonly viewport : ViewportService) {

    this._error$ = new BehaviorSubject<any>(null);
    // Maps the error stream asynchronously. This is a trick to ensure navigator view
    // updates consistently although children pages are responsible for error reporting
    // (so preventing ExpressionChangedAfterItHasBeenCheckedError to occur)
    this.error$ = this._error$.pipe( delay(0) );
  }

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs');/*|| this.media.isActive('sm');*/ }
  public get desktop(): boolean { return !this.mobile; }

  //public

  // Global error reporting
  public reportError(error: any): void { this._error$.next(error); }
  public clearError(): void { this._error$.next(null); }
}
