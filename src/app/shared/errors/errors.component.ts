import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContentService } from 'app/core';

@Component({
  selector: '[wmError]',
  template: '<span>{{ error }}</span>',
  styles: ['']
})
export class ErrorsComponent {

  private msgs = null;
  public error: string;
  
  constructor(private content : ContentService) {

    // Gets the localized error messages
    this.msgs = this.content.select("errors");
  }

  @Output('error') onError = new EventEmitter<string>();
  @Output('reset') onReset = new EventEmitter<void>(); 

  @Input('clear') clearError() {

    this.error = null; 
    this.onReset.emit();
  }

  @Input() timeout = 5000;

  @Input('wmError') set showError(error: string | any) {

    // Tries to decode the error object getting the code property, when defined, or
    // assumes the code itself is a string
    let code: string = error.code || error;

    // Turns the error code into camelCase
    let key = code.camelize().replace('/','.');

    // Look up the available error messages or return the error code itself if not found
    this.error = key.select(this.msgs, code);

    // Emits the displayed error message 
    this.onError.emit(this.error);
    
    // Makes sure to turn off the error message after the specified timeout
    setTimeout(() => this.clearError(), this.timeout );
  } 
}