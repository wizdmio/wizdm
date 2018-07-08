import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { MatSelect } from '@angular/material';

export type ListItemOption = {
  
  value: string,
  label: string
}

export interface ListItemField {
  
  type?: 'input' | 'select',
  name?: string,
  icon?: string,
  label?: string,
  value?: string,
  options?: string[] | ListItemOption[],
  hint?: string,
}

export interface ListItemValidators {

  validators?: ValidatorFn[],
  errors?: {
    required?: string,
    email?: string
  }
}

@Component({
  selector: 'wm-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {

  @ViewChild('refControl') refControl: ElementRef;
  @ViewChild('refSelect') refSelect: MatSelect;

  @Input() editable = true; // Enable the edit mode and swhow the icon
  @Input() appearence = 'legacy'; // Appearence style for mat-form-field

  @Input() field: ListItemField = {};
  @Input('validators') set setValidators(validators: ListItemValidators) {
    
    // Saves the error messages in the errors object
    this.errors = validators.errors;

    // Install the requested validators
    if(validators.validators && validators.validators.length > 0) {
      this.control.setValidators(validators.validators);
    }
  }

  @Output() editStart  = new EventEmitter<string>();
  @Output() editDone   = new EventEmitter<string>();

  private form: FormGroup;
  private control: FormControl;
  private editMode = false;// Switch between view/edit mode
  
  private errors: any = {};
  private get errorMessage() {
    
    // Evaluates the validation reported errors
    let errors = Object.keys(this.control.errors);
    
    // Returns the relevant error message
    return errors ? this.errors[errors[0]] : '';
  }

  private get fieldValue(): string {
    
    // Checks if the control is of type select and options are specified
    if(this.field.type == 'select' && this.field.options && this.field.options.length > 0) {

      // Checks options are specified as ListItemOption objects
      if(typeof this.field.options[0] != 'string') {

        // Returns the relevant label instead of the raw value
        const options: ListItemOption[] = <ListItemOption[]>this.field.options;
        return options.find( opt => opt.value == this.field.value).label;
      }
    }

    // Returns the raw value
    return this.field.value;
  }

  constructor() { 
    this.control = new FormControl( '', null );
    this.form = new FormGroup({control: this.control});
  }

  private viewMode() {

    // Switch back to view mode
    this.editMode = false;
    this.control.reset();
  }

  private setFocus() {

    // Makes sure the control gets the focus after rendering
    setTimeout( () => {
      
      if(this.field.type ==='input' && this.refControl) {
        this.refControl.nativeElement.focus();}

      if(this.field.type ==='select' &&  this.refSelect) {
        this.refSelect.focus();}
    });
  }

  private edit() {

    if(this.editable) {
      
      // Updates the control value
      this.control.patchValue(this.field.value);

      // Switch to edit mode
      this.editMode = true;

      // Focus the control
      this.setFocus();
     
      // Emits editStart
      this.editStart.emit(this.field.name);
    }
  }

  private updateControl() {

    //console.log('debug', this.control);

    // Wait one tick to make sure select control is up to date after a selection from the panel
    setTimeout( () => {

      // Skips on no changes
      if(this.control.pristine || this.control.value == this.field.value) {
        this.viewMode();
        return;
      }

      // If there are actual modifications and all is fine
      if(this.control.valid) {

        // Emits editDone with the new value
        this.editDone.emit(this.control.value);
        
        // Switch back to view mode
        this.viewMode();
      }
    });
  }

  private skipSelect() {

    // Work-around to prevend unwanted cancellation due to the blur event while selecting
    // an option from the panel 
    if(!this.refSelect.panelOpen){
      this.viewMode();
    }
  }

  private keydown(ev) {
    if(ev.key === 'Escape') { // Cancel when pressing ESC
      this.viewMode();
    }
  }
}
