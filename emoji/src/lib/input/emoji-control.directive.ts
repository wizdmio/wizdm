import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Directive, OnDestroy, forwardRef } from '@angular/core';
import { EmojiInput } from '../input/emoji-input.component';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Bridges the EmojiInput with the Angular's form API implementing a ControlValueAccessor
 */
@Directive({
  selector: 'wm-emoji-input[ngModel], wm-emoji-input[formControl], wm-emoji-input[formControlName]',
  exportAs: 'EmojiControl',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EmojiControl), multi: true }
  ]
})
export class EmojiControl implements OnDestroy, ControlValueAccessor {

  private change$: Observable<string>;
  private blur$: Observable<void>;
  private dispose$ = new Subject();

  constructor(readonly input: EmojiInput) { 
    // Creates an observable from the input's element blur event for further use 
    this.blur$ = fromEvent<void>(input.element, 'blur').pipe( takeUntil(this.dispose$) );
    // Creates an observable from the input valueChange event for further use 
    this.change$ = input.valueChange.pipe( takeUntil(this.dispose$) );
  }

  /** Called by the forms API to write to the view when programmatic changes from model to view are requested */
  writeValue(value: any): void {

    //if(typeof value === 'string') {
    this.input.value = value;
    //}
  }  

  /** Registers a callback function that is called when the control's value changes in the UI */
  registerOnChange(fn: (_:any) => void): void {

    this.change$.subscribe( value => fn(value) );
  }

  /** Registers a callback function is called by the forms API on initialization to update the form model on blur. */
  registerOnTouched(fn: () => void): void {

    this.blur$.subscribe( () => fn() );
  }

  /** 
   * Function that is called by the forms API when the control status changes to or from 'DISABLED'. 
   * Depending on the status, it enables or disables the appropriate DOM element. 
   */
  setDisabledState(disabled: boolean): void {

    this.input.disabled = disabled;
  }

  // Disposes of the observables on destroy
  ngOnDestroy() {
    this.dispose$.next();
    this.dispose$.complete();
  }
}