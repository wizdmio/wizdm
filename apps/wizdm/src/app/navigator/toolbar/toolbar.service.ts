import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { map, switchMap, delay } from 'rxjs/operators';

export type wmAction = {
  caption?:  string,
  icon?:     string,
  code?:     string,
  link?:     string,
  params?:   any,
  menu?:     wmAction[],

  enabler?:  Observable<boolean>
};

/** Defines the toolbar action button */
class ActionButton {

  private enabler$ = new BehaviorSubject<boolean>(true);

  constructor(public data: wmAction) { 
    // Maps the action button enabler asynchronously. This is a trick to ensure navigator view
    // updates consistently although children pages are responsible for action bar update
    // (so preventing ExpressionChangedAfterItHasBeenCheckedError to occur)
    data.enabler = this.enabler$.pipe( delay(0) );
  }

  public enable(enable: boolean) {
    this.enabler$.next(enable);
  }
}

/** Defines the toolbar action state */
class ActionState {

  private actions$: BehaviorSubject<ActionButton[]>;

  private get actions(): ActionButton[] { return this.actions$.value;}

  public buttons$: Observable<wmAction[]>;
  public events$: Subject<string> = new Subject();

  constructor(buttons: wmAction[]) {
    // Wraps the wmAction into ActioButton for internal use
    this.actions$ = new BehaviorSubject<ActionButton[]>( buttons.map( btn => new ActionButton(btn) ));
    // Maps the action buttons array asynchronously. This is a trick to ensure navigator view
    // updates consistently although children pages are responsible for action bar update
    // (so preventing ExpressionChangedAfterItHasBeenCheckedError to occur)
    this.buttons$ = this.actions$.pipe( delay(0), map( actions => actions.map( act => act.data ) ));
  }

  /** Enables/disables the specified action button  */
  public enable(code: string, enable: boolean) {
    // Seeks the requested action by code
    const action = this.actions.find( action => action.data.code === code );
    // Pushes the new enable state
    !!action && action.enable(enable);
  }

  public dispose() { this.events$.complete(); }
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarService implements OnDestroy {

  private state$ = new BehaviorSubject<ActionState>(null);
  private savedStates: ActionState[] = [];
  
  public buttons$: Observable<wmAction[]>;
  public some$: Observable<boolean>;
  
  constructor() { 
    // Maps the buttons to the current state's ones
    this.buttons$ = this.state$.pipe( switchMap( state => !!state ? state.buttons$ : of([]) ));
    // Maps the buttons to a boolean reporting actions are available or not
    this.some$ = this.buttons$.pipe( map( buttons => buttons.length > 0));
  }

  ngOnDestroy() { this.clearActions(); }
  /**
   * Activtes toolbar actions
   * @param buttons the array of action buttons or links ot display
   * @param save an optional flag to save the current status to be restored
   */
  public activateActions(buttons: wmAction[], save?: boolean): Observable<string> {
    // Saves the current state on request
    if(save) { this.savedStates.push(this.state$.value); }
    else { this.clearActions(); }
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
   * Enables/disables the specified action
   * @param code the code identifying the action
   * @param enable the enable state
   */
  public enableAction(code: string, enable: boolean) {
    !!this.state$.value && this.state$.value.enable(code, enable);
  }
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
