import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Observer, combineLatest } from 'rxjs';
import { takeUntil, switchMap, map, zip } from 'rxjs/operators';

export type toolbarAction = {
  caption?: string,
  icon?:    string,
  
  code?:    string,
  enabler?: Observable<boolean>
  
  link?:    string,
  params?:  any,

  menu?:    toolbarAction[]
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

/**
 * Defines the toolbar action state
 */
class ActionState {

  // Action events emitter
  public events$: Subject<string>;

  // Subject to dispose for all the Obervables belonging to this state
  private dispose$ : Subject<void>;

  /**
   * Contructs the action state using the given array of actions
   */
  constructor(private actionButtons: toolbarAction[]) {
    this.events$ = new Subject<string>();
    this.dispose$ = new Subject<void>();
  }

  /**
   * @returns the array of action buttons
   */
  public get buttons() {
    return this.actionButtons;
  }

  /**
   * Emits an action code towards the action observer
   * @param code the code describing the action to be performed
   */
  public performAction(code: string) {
    this.events$.next(code);
  }

  /**
   * Creates an action enabler for the observer to enable/disable the action button
   * @param code the code identifying the action to consider 
   * @returns the action enabler object
   */
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

  public dispose() {
    if(this.dispose$) { this.dispose$.next(); this.dispose$.complete();}
    if(this.events$) { this.events$.complete();}
    this.actionButtons = [];
  }
}

@Injectable({
  providedIn: 'root'
})
/**
 * Service to interacts with the navigation toolbar
 */
export class ToolbarService implements OnDestroy {
  
  private savedStates: ActionState[] = [];
  private actionState: ActionState;
  
  constructor() {}

  get buttons(): toolbarAction[] {
    return this.actionState ? this.actionState.buttons : [];
  }

  private deleteActions(): void {
    if(this.actionState) { 
      this.actionState.dispose();
      delete this.actionState;
    }
  }

  /**
   * 
   * @param buttons the array of action buttons or links ot display
   * @param save an optional flag to save the current status to be restored
   */
  public activateActions(buttons: toolbarAction[], save?: boolean): Observable<string> {

    if(save && this.actionState) {
      this.savedStates.push(this.actionState);
    }
    else {
      this.clearActions();
    }

    this.actionState = new ActionState(buttons || []);
    return this.actionState.events$;
  }

  /**
   * Emits an action code to the observer identifying the action to be performed
   * @param code the action code identifying the action to be performed
   */
  public performAction(code: string): void {
    if(this.actionState) {
      this.actionState.performAction(code);
    }
  }

  /**
   * Creates an action enabler for the observer to enable/disable the corresponding action button
   * @param code the code identifying the action
   */
  public actionEnabler(code: string): ActionEnabler {
    return this.actionState ? this.actionState.actionEnabler(code) : undefined;
  }

  /**
   * Restores the previously saved action bar
   */
  public restoreActions(): void {
    if(this.savedStates.length) {
      this.deleteActions();
      this.actionState = this.savedStates.pop();
    }
  }

  /**
   * Clears the action bar
   */
  public clearActions(): void {
    this.savedStates.forEach( () => this.restoreActions() );
    this.deleteActions();
  }

  ngOnDestroy() { this.clearActions();}

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
