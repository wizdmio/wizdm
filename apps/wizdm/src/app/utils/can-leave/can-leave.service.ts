import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { flatMap, first } from 'rxjs/operators';

export type CanLeaveType = boolean|Promise<boolean>|Observable<boolean>;

@Injectable()
export class CanLeaveGuard implements CanDeactivate<any> {

  private observer$ = new BehaviorSubject<CanLeaveType>(true);

  /** Pushes a quanding value into the guard observer to resolve when leaving the page */
  public allowDeactivation(guard: CanLeaveType) {
    this.observer$.next(guard);
  }

  // Implements the CanDeactivate interface to conditionally prevent leaving the page
  canDeactivate(/*component, route, state, next*/): CanLeaveType {

    // Returns an observable resolving into a suitable guarding value
    return this.observer$.pipe( 
      // Flatten the observer to a lower order when needed
      flatMap( canLeave => typeof(canLeave) === 'boolean' ? of(canLeave) : canLeave ),
      // Makes sure the observable always resolves
      first()
    );
  }
}