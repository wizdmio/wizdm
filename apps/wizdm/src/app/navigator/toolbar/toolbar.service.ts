import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { map, switchMap, delay, take, filter } from 'rxjs/operators';

export type wmAction = {
  caption?:  string,
  icon?:     string,
  code?:     string,
  link?:     string,
  params?:   any,
  menu?:     wmAction[],
  disabled?: boolean,
  enabler?:  Observable<boolean>
};

/** Defines the toolbar action button */
class ActionButton {

  private enabler$: BehaviorSubject<boolean>;

  constructor(public data: wmAction) {
    // Creates the enabler observable with the given initial state
    this.enabler$ = new BehaviorSubject<boolean>(!data.disabled);
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
  private events$: Subject<string> = new Subject();
  readonly buttons$: Observable<wmAction[]>;
  
  constructor(buttons: wmAction[]) {
    // Wraps the wmAction into ActioButton for internal use
    this.actions$ = new BehaviorSubject<ActionButton[]>( buttons.map( btn => new ActionButton(btn) ));
    // Maps the action buttons array out of actions
    this.buttons$ = this.actions$.pipe( map( actions => actions.map( act => act.data ) ));
  }

  public get handler(): Observable<string> {
    return this.events$.asObservable();
  }

  public emit(code: string) {
    this.events$.next(code);
  }

  /** Enables/disables the specified action button  */
  public enable(code: string, enable: boolean) {
    // Seeks the requested action by code
    this.actions$.pipe( 
      take(1), 
      map( actions => actions.find( action => action.data.code === code ) ),
      filter( action => !!action ) 
      // Pushes the new enable state
    ).subscribe( action => action.enable(enable) );
  }

  public dispose() { this.events$.complete(); }
}

@Injectable()
export class ToolbarService implements OnDestroy {

  private state$ = new BehaviorSubject<ActionState>(null);
  private savedStates: ActionState[] = [];
  
  public buttons$: Observable<wmAction[]>;
  public some$: Observable<boolean>;
  
  constructor() { 
    // Maps the buttons to the current state's ones asynchronously. This is a trick to ensure navigator view
    // updates consistently although children pages are responsible for action bar update
    // (so preventing ExpressionChangedAfterItHasBeenCheckedError to occur)
    this.buttons$ = this.state$.pipe( switchMap( state => !!state ? state.buttons$ : of([]) ), delay(0));
    // Maps the buttons to a boolean reporting actions are available or not
    this.some$ = this.buttons$.pipe( map( buttons => buttons.length > 0 ));
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
    return state.handler;
  }
  /**
   * Emits an action code to the observer identifying the action to be performed
   * @param code the action code identifying the action to be performed
   */
  public performAction(code: string) {
    
    this.state$.pipe( take(1), filter( state => !!state ) )
      .subscribe( state => state.emit( code ));
  }
  /**
   * Enables/disables the specified action
   * @param code the code identifying the action
   * @param enable the enable state
   */
  public enableAction(code: string, enable: boolean) {

    this.state$.pipe( take(1), filter( state => !!state ) )
      .subscribe( state => state.enable( code, enable ));
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
