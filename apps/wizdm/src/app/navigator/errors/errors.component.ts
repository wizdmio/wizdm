import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, animate, style, transition } from '@angular/animations';
import { ContentManager } from '@wizdm/content';

const $timing = '400ms cubic-bezier(0.5,0.5,0.5,1.0)';

@Component({
  selector: 'wm-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  animations: [
    trigger('inflate', [
      transition(':enter', [
        style({ 
          opacity: '0', 
          height: '0',
          transform: 'rotateX(90deg)'
        }),
        animate($timing, style('*'))
      ]),
      transition(':leave', [
        animate($timing, style({ 
          opacity: '0', 
          height: '0',
          transform: 'rotateX(90deg)'
        }))
      ])
    ])
  ]
})
export class ErrorsComponent {

  private msgs = null;
  public error: string;
  
  constructor(private content: ContentManager) {

    // Gets the localized error messages
    this.msgs = this.content.select("errors");
  }

  @Input() timeout = 5000;

  @Input('error') set showError(error: string | any) {

    // Skips undefined or null
    if(!error) { return; }

    // Tries to decode the error object getting the code property, when defined, or
    // assumes the code itself is a string
    let code: string = error.code || error;

    // Turns the error code into camelCase
    let key = code.camelize().replace('/','.');

    // Look up the available error messages or return the error code itself if not found
    this.error = key.select(this.msgs, code);

    // Makes sure to turn off the error message after the specified timeout
    setTimeout(() => this.clearError(), this.timeout );
  }

  @Output() clear = new EventEmitter<void>();

  public clearError(): void {
    this.error = null;
    this.clear.emit();
  }
}
