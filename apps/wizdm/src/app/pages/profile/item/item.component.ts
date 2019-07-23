import { Component, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { $itemAnimations } from './item-animations';
import moment from 'moment';

export type UserItemOption = {
  
  value: string,
  label: string,
  icon?: string
}

export interface UserItemValidators {

  validators?: ValidatorFn[],
  errors?: {
    required?: string,
    email?: string
  }
}

@Component({
  selector: 'wm-user-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  animations: $itemAnimations
})
export class UserItemComponent {

  // This is a dummy animation to prevent @slideout kicking in during page rendering
  @HostBinding('@halt') halt = true;

  readonly form: FormGroup;
  readonly control: FormControl;
  private errors: any = {};

  public edit = false;// Switch between view/edit mode

  constructor() { 

    this.control = new FormControl( '', null );
    this.form = new FormGroup({control: this.control});
  }

  @Input() editable = true; // Enable the edit mode
  @Input() type: 'input'|'select'|'date' = 'input';
  @Input() name: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() value: string;
  @Input() hint: string;

  @Input() options: string[] | UserItemOption[];

  @Input('validators') set setValidators(validators: UserItemValidators) {
    
    // Saves the error messages in the errors object
    this.errors = validators ? validators.errors : null;

    // Install the requested validators
    if(validators && validators.validators && validators.validators.length > 0) {
      this.control.setValidators(validators.validators);
    }
  }

  @Input() mobile: boolean = false;

  @Output() editStart  = new EventEmitter<string>();
  @Output() editDone   = new EventEmitter<string>();

  public get errorMessage() {
    
    // Evaluates the validation reported errors
    let errors = Object.keys(this.control.errors);
    
    // Returns the relevant error message
    return this.errors && errors ? this.errors[errors[0]] : '';
  }

  private get hasOptions() : boolean {

    // Checks if the control has object options
    return this.type === 'select' && 
           this.options && 
           this.options.length > 0 && 
           typeof this.options[0] !== 'string';
  }

  private get matchedOption() : UserItemOption {

    const value = this.control.value || this.value;
    let option = {} as UserItemOption;

    // This verbose test is to accept 'false' as a valid value
    if(value !== null && typeof(value) !== 'undefined' && this.hasOptions) {
      option = (<UserItemOption[]>this.options)
        .find( opt => opt.value == value);
    }

    return option;
  }

  public get displayValue(): string {

    if(this.type === 'date') {
      return this.value ? moment(this.value, moment.defaultFormat).format('ll') : '';
    }

    return this.matchedOption.label || this.value;
  }

  public get displayIcon(): string {
    return this.matchedOption.icon || this.icon;
  }

  private viewMode() {

    // Switch back to view mode
    this.edit = false;
    this.control.reset();
  }

  public editMode() {

    // No action
    if(!this.editable) { return; }

    // Makes sure to properly convert the value into a moment object whenever it's undefined or null
    const value = this.type === 'date' ? this.value ? moment(this.value, moment.defaultFormat) : moment() : this.value;

    // Updates the control value
    this.control.patchValue(value);

    // Switch to edit mode
    this.edit = true;
    
    // Emits editStart
    this.editStart.emit(this.name);
  }

  public updateControl(): boolean {

    // Convert the value back to a string
    const value: string = this.type === 'date'  && this.control.value ? 
      (<moment.Moment>this.control.value).format(moment.defaultFormat) : this.control.value;
    
    // Skips on no changes
    if(this.control.pristine || this.value == value) {
      this.viewMode();
      return true;
    }

    // If there are actual modifications and all is fine
    if(this.control.valid) {

      // Emits editDone with the new value
      this.editDone.emit(value);
      
      // Switch back to view mode
      this.viewMode();
      return true;
    }

    return false;
  }

  @HostListener('window:keydown', ['$event']) keydown(event: KeyboardEvent) {

    if(event.key === 'Escape' && this.edit) { // Cancel when pressing ESC
      this.viewMode();
    }
  }
}
