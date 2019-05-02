import { Component, Input, Output, EventEmitter } from '@angular/core';
import { $animations } from './errors.animations';
import { Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'wm-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  animations: $animations
})
export class ErrorsComponent {

  private timer: any;
  public error: string;

  @Input() msgs = {};

  @Input('error') set showError(error: string | any) {

    // Clears when  null
    if(!error) { this.clearError(); }
    else {
      // Tries to decode the error object getting the code property, when defined, or
      // assumes the code itself is a string
      const code: string = error.code || error;
      // Turns the error code into camelCase
      const key = code.camelize().replace('/','.');

      // Look up the available error messages or return the error code itself if not found
      this.error = key.select(this.msgs, code);

      // Makes sure to turn off the error message after the specified timeout
      this.timer = setTimeout(() => this.clearError(), this.timeout );
    }
  }

  @Output() clear = new EventEmitter<void>();

  @Input() timeout = 5000;

  public clearError() {
    clearTimeout(this.timer);
    this.error = null;
    this.clear.emit();
  }
}
