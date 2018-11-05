import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to interacts with the main navigation scroll view
 */
export class ViewportService implements OnDestroy {

  private status: boolean[] = [];

  public enable$ = new BehaviorSubject<boolean>(true);
  public scrollTo$ = new EventEmitter<string>();

  public scrollPosition: EventEmitter<'top' | 'bottom'>;

  constructor() { }

  ngOnDestroy() { this.enable$.complete();}

  /**
   * Enables or disables the navigation scrolling
   * @param enable true to enable the scrolling, false to disable it
   * @param save an optiona flag requesting to save the previous status for restoration
   */
  public enable(enable: boolean, save?: boolean): void {

    if(save) {
      this.status.push(this.enable$.value);
    }

    this.enable$.next(enable);
  }

  /**
   * Restores a previously saved scrolling status
   */
  public restore(): void {
    if(this.status.length) {
      this.enable( this.status.pop() );
    }
  }

  /**
   * Used to scroll the content of the navigation view at a specific position
   * @param selector a query selector pointing the lement to be shown by scrollIntoView()
   */
  public scrollTo(selector: string) {
    this.scrollTo$.emit(selector);
  }
}
