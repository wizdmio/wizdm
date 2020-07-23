import { Directive, forwardRef } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';
import { StripeElement } from '../stripe-element';
import { Observable, merge } from 'rxjs';

/**
 * MatFormFieldControl implementation for StripeElement
 */
@Directive({
  selector: '[matStripe]',
  host: { 'class': 'wm-stripe-material' },
  providers: [
    { provide: MatFormFieldControl, useExisting: forwardRef(() => StripeMaterial) }
  ]
})
export class StripeMaterial implements MatFormFieldControl<any> {

  constructor(readonly element: StripeElement<any>) { 

    this.stateChanges = merge(
      element.readyChange,
      element.focusChange,
      element.blurChange,
      element.valueChange,
    );
  }

  /** The value of the control. */
  get value(): any | null { return this.element.value || null; };

  /**
   * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
   * needs to run change detection.
   */
  readonly stateChanges: Observable<void>;

  /** The element ID for this control. */
  readonly id: string;

  /** The placeholder for this control. */
  readonly placeholder: string;

  /** Gets the NgControl for this control. */
  readonly ngControl: NgControl | null;

  /** Whether the control is focused. */
  get focused(): boolean { return this.element.focused; }

  /** Whether the control is empty. */
  get empty(): boolean { return !this.element.empty; }

  /** Whether the control is disabled. */
  get disabled(): boolean { return this.element.disabled; }

  /** Whether the `MatFormField` label should try to float. */
  get shouldLabelFloat(): boolean { return true; };

   /** Whether the control is required. */
  readonly required: boolean;

  /** Whether the control is in an error state. */
  get errorState(): boolean {
    const value = this.element.value;   
    return !!value && !!value.error;  
  };

  /** Sets the list of element IDs that currently describe this control. */
  setDescribedByIds(ids: string[]): void { }

  /** Handles a click on the control's container. */
  onContainerClick(event: MouseEvent): void {
    this.element.focus();
  };
}