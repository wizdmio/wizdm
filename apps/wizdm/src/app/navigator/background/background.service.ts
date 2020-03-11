import { Observable, BehaviorSubject, animationFrameScheduler, scheduled } from 'rxjs';
import { Injectable } from '@angular/core';

/** Background styling service, used to back propagate the navigator's background styling from the pages */
@Injectable({
  providedIn: 'root'
})
export class BackgroundStyle extends Observable<any> {

  readonly style$ = new BehaviorSubject<any>(undefined);

  // Ensures the style being applied according to the animationFrameScheduler (so to say in-sync with the rendering)
  // preventing the notorious ExpressionChangedAfterItHasBeenChecked exception without introducing any delay the 
  // user may otherwise perceive when navigating
  constructor() { super( subscriber => scheduled(this.style$, animationFrameScheduler).subscribe(subscriber) ); }

  /** Applies the given style pushing it along the service observable */
  public apply(style: any) { this.style$.next(style); }

  /** Clears the current style  */
  public clear() { this.style$.next(undefined); }
}
