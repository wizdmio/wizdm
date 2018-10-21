import { Injectable } from '@angular/core';
import { ActionState, ActionEnabler, wmAction } from './navigator-actions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  constructor() {}

  //-- Error Handler -------------
  private errorObj: any;

  public get error() {
    return this.errorObj;
  }

  public reportError(error: any): void {
    this.errorObj = error;
  }

  public clearError(): void {
    this.errorObj = null;
  }

  //-- Action Buttons ------------
  private savedStates: ActionState[] = [];
  private actionState: ActionState;

  get buttons(): wmAction[] {
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
  public activateActions(buttons: wmAction[], save?: boolean): Observable<string> {

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
}
