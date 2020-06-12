import { Directive, forwardRef, Optional, Self } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Observable, merge, fromEvent } from 'rxjs';
import { EmojiInput } from '@wizdm/emoji/input';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'wm-emoji-input[matEmoji]',
  exportAs: 'EmojiMaterial',
  providers: [
    { provide: MatFormFieldControl, useExisting: forwardRef(() => EmojiMaterial) }
  ],
  // We take advantage from mat-input-element styling provided by the mat-form-field contaienr
  host: { "class": "mat-input-element" }
})
export class EmojiMaterial implements MatFormFieldControl<any> {

  /** Stream that emits whenever the state of the control changes such that the parent `MatFormField` needs to run change detection. */
  readonly stateChanges: Observable<void>;

  /** Gets the NgControl for this control or null. */
  constructor(@Optional() private formField: MatFormField, @Optional() @Self() readonly ngControl: NgControl, private input: EmojiInput) {

    if(!formField) {
      throw new Error("matEmoji directive is ment to be used within a mat-form-field component!");
    }

    this.stateChanges = merge<void>(

      fromEvent(this.input.element, 'blur'),
      this.input.valueChange
    );    
  }

  /** The value of the control. */
  get value(): any | null { return this.input.value; };

  /** The element ID for this control. */
  readonly id: string;

  /** The placeholder for this control. */
  get placeholder(): string { return this.input.placeholder; };

  /** Whether the control is focused. */
  get focused(): boolean { return this.input.focused; }

  /** Whether the control is empty. */
  get empty(): boolean { return !this.input.value; }

  /** Whether the control is disabled. */
  get disabled(): boolean { 

    if(this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }    
    return this.input.disabled; 
  }

  /** Whether the control is required. */
  get required(): boolean { return this.input.required; }

  /** Whether the `MatFormField` label should try to float. */
  get shouldLabelFloat(): boolean { return this.focused || !this.empty; }

  /** Whether the control is in an error state. */
  get errorState(): boolean { return !!this.ngControl && !!this.ngControl.errors; }

  /** Sets the list of element IDs that currently describe this control. */
  setDescribedByIds(ids: string[]): void { }

  /** Handles a click on the control's container. */
  onContainerClick(event: MouseEvent): void {
    this.input.focus();
  }
}