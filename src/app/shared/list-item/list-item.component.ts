import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { MatSelect } from '@angular/material';
/*
export type ListItemOption = {
  
  label: string,
  value: string
}
*/
export interface ListItemField {
  
  type?: 'input' | 'email' | 'textarea' | 'select',
  name?: string,
  icon?: string,
  label?: string,
  value?: string,
  options?: string[],
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

  @Output() editStart  = new EventEmitter<void>();
  @Output() editDone   = new EventEmitter<string>();

  private control: FormControl;
  private form: FormGroup;
  private editMode = false;// Switch between view/edit mode
  
  private errors: any = {};
  private get errorMessage() {
    
    // Evaluates the validation reported errors
    let errors = Object.keys(this.control.errors);
    
    // Returns the relevant error message
    return errors ? this.errors[errors[0]] : '';
  }

  constructor() { 
    this.control = new FormControl( '', null );
    this.form = new FormGroup({ value: this.control });
  }
/*
  private get fieldValue() {

    if(typeof this.field.value === 'string'){
      return this.field.value;
    }

    return (<ListItemOption>this.field.value).label;
  }

  private compareSelect( opt: ListItemOption, val: ListItemOption) {
    return opt.value === val.value;
  }
*/
  private setFocus() {

    // Makes sure the control gets the focus after rendering
    setTimeout( () => {
      
      if(this.refControl) {
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
      this.editStart.emit();
    }
  }

  private updateControl() {

    if(this.control.pristine) {
      this.editMode = false;
      return;
    }

    // If there are actual modifications and all is fine
    if(this.control.valid) {

      console.log('Updating value: ', this.control.value);

      // Emits editDone with the new value
      this.editDone.emit(this.control.value);

      // Switch back to view mode
      this.editMode = false;

      // Resets the control
      this.control.reset();
    }    
  }

  private changeSelect(newValue) {

    // If there are actual modifications and all is fine
    console.log('Updating value: ', newValue);

    // Emits editDone with the new value
    this.editDone.emit(newValue);

    // Switch back to view mode
    this.editMode = false;    
  }

  private blurSelect() {

    // Work-around to prevend unwanted cancellation due to the blur event while selecting
    // an option from the panel 
    if(!this.refSelect.panelOpen){
    
      // Switch to edit mode
      this.editMode = false;
    }
  }

  private keydown(ev) {
    if(ev.key === 'Escape') { // Cancel when pressing ESC
      this.editMode = false;
    }
  }
}
