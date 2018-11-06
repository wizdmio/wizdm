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

  constructor() { }

  ngOnDestroy() { this.enableScroll$.complete();}

  //-- Viewport mirror ---
  // Posiiton
  public position$ = new BehaviorSubject<[number, number]>(undefined);
  // Client rect 
  public rect$ = new BehaviorSubject<ClientRect>(undefined);
  // Scroll 'top' 'bottom' event
  public scrollPosition: EventEmitter<'top' | 'bottom'>;

  /**
   * Enables or disables the navigation scrolling
   * @param enable true to enable the scrolling, false to disable it
   * @param save an optiona flag requesting to save the previous status for restoration
   */
  public enableScroll(enable: boolean, save?: boolean): void {

    if(save) {
      this.status.push(this.enableScroll$.value);
    }

    this.enableScroll$.next(enable);
  }

  // Hook for ViewportDirective
  public enableScroll$ = new BehaviorSubject<boolean>(true);

  /**
   * Restores a previously saved scrolling status
   */
  public restoreScroll(): void {
    if(this.status.length) {
      this.enableScroll( this.status.pop() );
    }
  }

  /**
   * Used to scroll the content of the navigation view at a specific position
   * @param selector a query selector pointing the lement to be shown by scrollIntoView()
   */
  public scrollToElement(selector: string) {
    this.scrollToElement$.emit(selector);
  }

  // Hook for ViewportDirective
  public scrollToElement$ = new EventEmitter<string>();
}
