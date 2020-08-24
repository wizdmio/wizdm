import { Observable, BehaviorSubject, animationFrameScheduler } from 'rxjs';
import { scan, map, observeOn } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export interface BackgroundStyle {
  "background-image"       : string;
  "backgroung-clip"        : string;
  "background-size"        : string;
  "background-color"       : string;
  "background-repeat"      : string;
  "background-origin"      : string;
  "background-position"    : string;
  "background-attachment"  : string;
}

@Injectable({
  providedIn: 'root'
})
export class BackgroundObservable extends Observable<BackgroundStyle>{

  // Background style 
  private styler$ = new BehaviorSubject<BackgroundStyle|string>(undefined);
  private inner$: Observable<BackgroundStyle>;

  constructor() { 
    
    super( observer => this.inner$.subscribe(observer) );

    // Builds the innes observable to support nesting images
    this.inner$ = this.styler$.pipe(

      // Buffers the image requests
      scan( (buffer, value) => {

        // Resets the buffer
        if(!value) { buffer = []; }

        // Clears a previously applied image
        else if(typeof value === 'string') {

          // Seeks for the image within the buffer and removes it
          const index = buffer.findIndex( item => item["background-image"] === value );
          if(index >= 0) { buffer.splice(index, 1); }

        }
        // Pushes the new image into the buffer otherwise
        else { buffer.push(value); }
        return buffer;
        
      }, [] as BackgroundStyle[]),

      // Always emit the last buffer item
      map( buffer => buffer[buffer.length - 1] ), 
      
      // Ensures the style being applied according to the animationFrameScheduler (so to say in-sync with the rendering)
      // preventing the notorious ExpressionChangedAfterItHasBeenChecked exception without introducing any delay the 
      // user may otherwise perceive when navigating    
      observeOn(animationFrameScheduler) 
    );
  }

  /** Applies the given style to the navigator's content background */
  public applyBackground(style: BackgroundStyle): string { 

    if(!style["background-image"]) { return undefined; }
    return this.styler$.next(style), style["background-image"];
  }

  /** Clears the background  */
  public clearBackground(image?: string) { 
    this.styler$.next(image); 
  }
}
