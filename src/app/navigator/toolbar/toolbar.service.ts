import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Observer, combineLatest } from 'rxjs';
import { takeUntil, switchMap, map, zip } from 'rxjs/operators';

export type toolbarAction = {
  caption: string,
  link?: string,
  params?: any,
  code?: string,
  enabler?: Observable<boolean>
};

/**
 * Implements a simple class to wrap tne action enabler observer
 */
export class ActionEnabler {

  constructor(private observer: Observer<boolean>) {}

  /** Enables/disables the corresponding action button */
  public enable(value: boolean) {
    this.observer.next(value);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarService implements OnDestroy {
  
  private actionButtons: toolbarAction[] = [];
  private event$: Subject<string>;
  private dispose$: Subject<void>;
  
  constructor() {}

  get buttons(): toolbarAction[] {
    return this.actionButtons;
  }

  public clearActions() {
    this.actionButtons = [];
    this.dispose();
  }

  public activateActions(buttons: toolbarAction[]): Observable<string> {

    this.clearActions();

    this.actionButtons.push(...buttons || []);

    this.dispose$ = new Subject<void>();

    return this.event$ = new Subject();
  }

  public performAction(code: string) {
    this.event$.next(code);
  }

  public actionEnabler(code: string): ActionEnabler {

    let enabler = new BehaviorSubject<boolean>(false);

    let index = this.actionButtons.findIndex( action => action.code === code );
    if( index >= 0 ) {

      this.actionButtons[index] = { 
        ...this.actionButtons[index], 
        enabler: enabler.pipe( takeUntil(this.dispose$) ) 
      };
    }

    return new ActionEnabler(enabler);
  }

  private dispose() {
    if(this.dispose$) { this.dispose$.next(); this.dispose$.complete();}
    if(this.event$) { this.event$.complete();}
  }

  ngOnDestroy() { this.dispose();}

  /*
  private enabler$: BehaviorSubject<toolbarAction[]>;

  public enableActions(): Observable<any> {

    return this.enabler$.pipe(

      switchMap( actions => {
        return combineLatest( actions.map( action => {
          return action.enabler.pipe( 
            map( enable => { 
              return { code: action.code, enable };
            })
          );
        }));
      }),

      zip( pairs => { 
        return pairs.reduce( (curr, next) => {
          curr[next.code] = next.enable;
          return curr;
        }, {} as any);
      })
    );
  }
*/
}
