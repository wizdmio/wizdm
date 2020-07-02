import { Directive, OnChanges, SimpleChanges, OnDestroy, Optional, Self } from '@angular/core';
import { ButtonTypeChanger, ButtonType } from './button-changer.directive';
import { Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MediaObserver } from '@angular/flex-layout';

/** The full list of selectors to install the ButtonMediaChanger on a MatButton */
const selector = `

  [mat-button][type.xs], [mat-button][type.sm], [mat-button][type.md], [mat-button][type.lg], [mat-button][type.xl], 
  [mat-button][type.lt-sm], [mat-button][type.lt-md], [mat-button][type.lt-lg], [mat-button][type.lt-xl],
  [mat-button][type.gt-xs], [mat-button][type.gt-sm], [mat-button][type.gt-md], [mat-button][type.gt-lg],

  [mat-flat-button][type.xs], [mat-flat-button][type.sm], [mat-flat-button][type.md], [mat-flat-button][type.lg], [mat-flat-button][type.xl], 
  [mat-flat-button][type.lt-sm], [mat-flat-button][type.lt-md], [mat-flat-button][type.lt-lg], [mat-flat-button][type.lt-xl],
  [mat-flat-button][type.gt-xs], [mat-flat-button][type.gt-sm], [mat-flat-button][type.gt-md], [mat-flat-button][type.gt-lg],

  [mat-icon-button][type.xs], [mat-icon-button][type.sm], [mat-icon-button][type.md], [mat-icon-button][type.lg], [mat-icon-button][type.xl], 
  [mat-icon-button][type.lt-sm], [mat-icon-button][type.lt-md], [mat-icon-button][type.lt-lg], [mat-icon-button][type.lt-xl],
  [mat-icon-button][type.gt-xs], [mat-icon-button][type.gt-sm], [mat-icon-button][type.gt-md], [mat-icon-button][type.gt-lg],

  [mat-raised-button][type.xs], [mat-raised-button][type.sm], [mat-raised-button][type.md], [mat-raised-button][type.lg], [mat-raised-button][type.xl], 
  [mat-raised-button][type.lt-sm], [mat-raised-button][type.lt-md], [mat-raised-button][type.lt-lg], [mat-raised-button][type.lt-xl],
  [mat-raised-button][type.gt-xs], [mat-raised-button][type.gt-sm], [mat-raised-button][type.gt-md], [mat-raised-button][type.gt-lg],

  [mat-stroked-button][type.xs], [mat-stroked-button][type.sm], [mat-stroked-button][type.md], [mat-stroked-button][type.lg], [mat-stroked-button][type.xl], 
  [mat-stroked-button][type.lt-sm], [mat-stroked-button][type.lt-md], [mat-stroked-button][type.lt-lg], [mat-stroked-button][type.lt-xl],
  [mat-stroked-button][type.gt-xs], [mat-stroked-button][type.gt-sm], [mat-stroked-button][type.gt-md], [mat-stroked-button][type.gt-lg],

  [mat-mini-fab][type.xs], [mat-mini-fab][type.sm], [mat-mini-fab][type.md], [mat-mini-fab][type.lg], [mat-mini-fab][type.xl], 
  [mat-mini-fab][type.lt-sm], [mat-mini-fab][type.lt-md], [mat-mini-fab][type.lt-lg], [mat-mini-fab][type.lt-xl],
  [mat-mini-fab][type.gt-xs], [mat-mini-fab][type.gt-sm], [mat-mini-fab][type.gt-md], [mat-mini-fab][type.gt-lg],

  [mat-fab][type.xs], [mat-fab][type.sm], [mat-fab][type.md], [mat-fab][type.lg], [mat-fab][type.xl], 
  [mat-fab][type.lt-sm], [mat-fab][type.lt-md], [mat-fab][type.lt-lg], [mat-fab][type.lt-xl],
  [mat-fab][type.gt-xs], [mat-fab][type.gt-sm], [mat-fab][type.gt-md], [mat-fab][type.gt-lg]
`;

/** Full list of ButtonMediaChanger inputs */
const inputs = [
  'type.xs', 'type.sm', 'type.md', 'type.lg', 'type.xl',
  'type.lt-sm', 'type.lt-md', 'type.lt-lg', 'type.lt-xl',
  'type.gt-xs', 'type.gt-sm', 'type.gt-md', 'type.gt-lg'
];

/** A map describing the type to apply according to the media queries */
interface MediaType {

  [alias: string]: ButtonType;
};

/** Changes the MatButton type according to specific media queries */
@Directive({ selector, inputs }) 
export class ButtonMediaChanger extends ButtonTypeChanger implements OnChanges, OnDestroy {

  private queries$ = new BehaviorSubject<MediaType>({});
  private sub: Subscription;

  constructor(media: MediaObserver, @Optional() @Self() button: MatButton, @Optional() @Self() anchor: MatAnchor) {
    // Contructs the bse ButtonChanger
    super(button, anchor);

    /** Subscribes to both the media observer and the input queries */
    this.sub = combineLatest( this.queries$, media.asObservable() ).subscribe( ([ queries, mediaChanges ]) => {
      
      /** Computes the target type based on combination of input queries and media changes */
      this.type = mediaChanges.reduce( (buttonType: ButtonType, mediaChange) => {

        return queries[mediaChange.mqAlias] || buttonType;

      }, undefined);
      
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    
    // Computes a new set of media queries based on the changed inputs
    this.queries$.next( Object.keys(changes).reduce( (queries, change) => {

      const prev = changes[change].previousValue;
      const curr = changes[change].currentValue;
      // Extract the media query alias from the changed input name
      const alias = change.split('.')[1];

      // Removes the previous value fromthe map
      if(prev && queries[alias]) { delete queries[alias]; }

      // Adds the new value to the map
      if(curr) { queries[alias] = curr; }

      return queries;

      // Starts from a copy of the latest query map
    }, { ...this.queries$.value } as MediaType ));
  }

  /** Disposes of the resources */
  ngOnDestroy() { this.sub.unsubscribe(); }
}
