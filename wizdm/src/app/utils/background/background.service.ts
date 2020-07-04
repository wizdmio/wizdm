import { Observable, BehaviorSubject, animationFrameScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundObservable extends Observable<{ [klass: string]: any; }>{

  // Background style 
  private bkStyler$ = new BehaviorSubject<{ [klass: string]: any; }>(undefined);

  constructor() { 
    // Ensures the style being applied according to the animationFrameScheduler (so to say in-sync with the rendering)
    // preventing the notorious ExpressionChangedAfterItHasBeenChecked exception without introducing any delay the 
    // user may otherwise perceive when navigating    
    super( observer => this.bkStyler$.pipe( observeOn(animationFrameScheduler) ).subscribe(observer) );
  }

  /** Applies the given style to the navigator's content background */
  public applyBackground(style: any) { 
    this.bkStyler$.next(style); 
  }

  /** Clears the current background  */
  public clearBackground() { 
    this.bkStyler$.next(undefined); 
  }
}
