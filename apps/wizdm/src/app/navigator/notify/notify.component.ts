import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { $animations } from './notify.animations';

export type notifyType = 'info'|'error';

export interface notifyMsg {
  type    : notifyType,
  message : string
};


@Component({
  selector: 'wm-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  host: { 'class': 'wm-notify' },
  animations: $animations
})
export class NotifyComponent {

  public  type    : notifyType;
  public  message : string;
  private timer   : any;
  
  @Input() msgs = {};

  @Input('notify') set showMessage(data: notifyMsg) {

    // Clears when null
    if(!data) { this.clear(); }
    else {
      // Specifies an error/info type message
      this.type = data.type || 'error';
      // Tries to decode the error object getting the code property, when defined, or
      // assumes the code itself is a string
      const code: string =  data.message || 'unknown';
      // Turns the error code into camelCase
      const key = code.camelize().replace('/','.');
      // Look up the available error messages or return the error code itself if not found
      this.message = key.select(this.msgs, code);
      // Makes sure to turn off the error message after the specified timeout
      this.timer = setTimeout(() => this.clear(), this.timeout );
    }
  }

  @Output() cleared = new EventEmitter<void>();

  @Input() timeout = 5000;

  public clear() {
    clearTimeout(this.timer);
    this.message = '';
    this.cleared.emit();
  }
}
