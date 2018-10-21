import { Observable, Subject, BehaviorSubject, Observer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class ActionState {

  // Action events emitter
  public events$: Subject<string>;

  // Subject to dispose for all the Obervables belonging to this state
  private dispose$ : Subject<void>;

  /**
   * Contructs the action state using the given array of actions
   */
  constructor(private actionButtons: wmAction[]) {
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