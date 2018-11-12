import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Observer } from 'rxjs';
import { map, takeUntil, delay } from 'rxjs/operators';

export type wmAction = {
  caption?: string,
  icon?:    string,
  
  code?:    string,
  enabler?: Observable<boolean>
  
  link?:    string,
  params?:  any,

  menu?:    wmAction[]
};

/**
 * Implements a simple class to wrap tne action enabler observer
 */
export class ActionEnabler extends BehaviorSubject<boolean> {

  constructor( value: boolean ) { super(value); }

  /** Enables/disables the corresponding action button */
  public enable(value: boolean) {
    this.next(value);
  }
  
  /** Returns the current enable status */
  public get isEnabled() {
   return this.value;
  }
}

/**
 * Defines the toolbar action state
 */
export class ActionState {

  /**  Action events emitter */
  public events$: Subject<string> = new Subject();

  // Subject to dispose for all the Obervables belonging to this state
  private dispose$: Subject<void> = new Subject();

  /**
   * Contructs the action state using the given array of actions
   */
  constructor(readonly buttons: wmAction[]) {}
  
  /** Enables/disables the specified action */
  /*public enableAction(code: string, value: boolean): void {
      
    // Seeks the requested action by code
    const index = this.actionButtons.findIndex( action => action.code === code );
    if( index >= 0 && this.actionButtons[index].enabler ) { 
      // Updates the enabler value
      this.actionButtons[index].enabler.next(value);
    }
  }*/

  /**
   * Creates an action enabler for the observer to enable/disable the action button
   * @param code the code identifying the action to consider 
   * @returns the action enabler object
   */
  public actionEnabler(code: string, startValue: boolean): ActionEnabler {

    // Seeks the requested action by code
    const index = this.buttons.findIndex( action => action.code === code );
    if( index >= 0 ) {
    
      // Creates an enabler observable
      const enabler = new ActionEnabler(startValue);

      // Updated the corresponding action button adding the relevan enabler observable
      this.buttons[index] = { 
        ...this.buttons[index], 
        enabler: enabler.pipe( takeUntil(this.dispose$) ) 
      };
      
      // Returns the enabler
      return enabler;
    }

    return null;
  }

  public dispose() {
    this.dispose$.next(); 
    this.dispose$.complete();
    this.events$.complete();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarService implements OnDestroy {

  //-- Action Buttons ------------
  private savedStates: ActionState[] = [];
  //private actionState: ActionState;

  /** Array of action buttons as observable */
  private state$: BehaviorSubject<ActionState> = new BehaviorSubject(null);
  public buttons$: Observable<wmAction[]>;
  public some$: Observable<boolean>;
  
  constructor() { 
    
    // Maps the state to button asynchronously. This is a trick to ensure navigator view
    // updates consistently although children pages are responsible for action bar update
    // (so preventing ExpressionChangedAfterItHasBeenCheckedError to occur)
    this.buttons$ = this.state$.pipe( delay(0), map( state => !!state ? state.buttons : [] ));

    // Maps the buttons to a boolean reporting actions are available or not
    this.some$ = this.buttons$.pipe( map( buttons => buttons.length > 0));
  }

  ngOnDestroy() { this.clearActions();}
/*
  get buttons(): wmAction[] {
    return this.actionState ? this.actionState.buttons : [];
  }

  public get someAction(): boolean {
    return !!this.buttons && this.buttons.length > 0;
  }
*/

  /**
   * 
   * @param buttons the array of action buttons or links ot display
   * @param save an optional flag to save the current status to be restored
   */
  public activateActions(buttons: wmAction[], save?: boolean): Observable<string> {

    if(save) {
      this.savedStates.push(this.state$.value);
    }
    else {
      this.clearActions();
    }

    // Creates the new action state
    const state = new ActionState(buttons || []);

    // Pushes the state into the observable
    this.state$.next( state );

    // Returns the state event osrevable for the observe to subscribe on actions
    return state.events$;
  }

  /**
   * Emits an action code to the observer identifying the action to be performed
   * @param code the action code identifying the action to be performed
   */
  public performAction(code: string) {
    !!this.state$.value && this.state$.value.events$.next(code);
  }

  /**
   * Creates an action enabler for the observer to enable/disable the corresponding action button
   * @param code the code identifying the action
   * @param value (default: true) to init the enable state
   */
  public actionEnabler(code: string, value = true): ActionEnabler {
    return !!this.state$.value ? this.state$.value.actionEnabler(code, value) : undefined;
  }
  
  /** Enables/disables the specified action */
  /*public enableAction(code: string, value: boolean): void {
    !!this.actionState && this.actionState.enableAction(code, value);
  }*/
  
  /**
   * Restores the previously saved action bar
   */
  public restoreActions(): void {
    if(this.savedStates.length) {
      !!this.state$.value && this.state$.value.dispose();
      this.state$.next( this.savedStates.pop() );
    }
  }

  /**
   * Clears the action bar
   */
  public clearActions(): void {
    this.savedStates.forEach( () => this.restoreActions() );
    !!this.state$.value && this.state$.value.dispose();
    this.state$.next(null);
  }
}
