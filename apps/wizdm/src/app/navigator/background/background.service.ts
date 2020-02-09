import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

/** Background styling service, used to back propagate the navigator's background styling from the pages */
@Injectable({
  providedIn: 'root'
})
export class BackgroundStyle extends Observable<any> {

  readonly style$ = new BehaviorSubject<any>(undefined);

  constructor() { super( subscriber => this.style$.pipe(delay(0)).subscribe(subscriber) ); }

  /** Applies the given style pushing it along the service observable */
  public apply(style: any) { this.style$.next(style); }

  /** Clears the current style  */
  public clear() { this.style$.next(undefined); }
}
