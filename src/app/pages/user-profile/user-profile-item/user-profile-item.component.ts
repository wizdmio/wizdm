import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { DateAdapter } from '@angular/material';
import { Subscription } from 'rxjs';
import { ContentService } from 'app/core';
import { $itemAnimations } from './user-profile-item-animations';

import * as moment from 'moment';

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
  selector: 'wm-profile-item',
  templateUrl: './user-profile-item.component.html',
  styleUrls: ['./user-profile-item.component.scss'],
  animations: $itemAnimations
})
export class UserProfileItemComponent implements OnInit, OnDestroy {

  // This is a dummy animation to prevent @slideout kicking in during page rendering
  @HostBinding('@halt') halt = true;

  private form: FormGroup;
  private control: FormControl;
  private errors: any = {};

  public edit = false;// Switch between view/edit mode

  private subMedia: Subscription;
  private mobile = false;

  constructor(private content : ContentService,
              private media   : ObservableMedia,
              private adapter : DateAdapter<any>) { 

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

  @Output() editStart  = new EventEmitter<string>();
  @Output() editDone   = new EventEmitter<string>();

  ngOnInit() {

    // Makes sure the datepicker will use the current locale
    const lang = this.content.language;
    this.adapter.setLocale(lang);

    // Use observble media to track for small screens enabling 'touchUi' version of datepicker
    this.subMedia = this.media.subscribe((change: MediaChange) => {
      this.mobile = change.mqAlias == 'xs';
    });    
  }

  ngOnDestroy() {
    this.subMedia.unsubscribe();
  }

  private get errorMessage() {
    
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

    if(value && this.hasOptions) {
      return (<UserItemOption[]>this.options)
        .find( opt => opt.value == value);
    }

    return {} as UserItemOption;
  }

  private get displayValue(): string {

    if(this.type === 'date') {
      return this.value ? moment(this.value).format('ll') : '';
    }

    return this.matchedOption.label || this.value;
  }

  private get displayIcon(): string {
    return this.matchedOption.icon || this.icon;
  }

  private viewMode() {

    // Switch back to view mode
    this.edit = false;
    this.control.reset();
  }

  private editMode() {

    // Makes sure to properly convert the value into a moment object whenever it's undefined or null
    let value = this.type === 'date' ? this.value ? moment(this.value) : moment() : this.value;

    // Updates the control value
    this.control.patchValue(value);

    // Switch to edit mode
    this.edit = true;
    
    // Emits editStart
    this.editStart.emit(this.name);
  }

  public updateControl(): boolean {

    // Convert the value back to a string
    let value: string = this.type === 'date'  && this.control.value ? 
      (<moment.Moment>this.control.value).toString() : this.control.value;
    
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
