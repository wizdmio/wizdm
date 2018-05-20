import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { togglerAnimations } from './toggler-animations';

@Component({
  selector: 'wm-toggler',
  templateUrl: './toggler.component.html',
  styleUrls: ['./toggler.component.scss'],
  animations: togglerAnimations
})
export class TogglerComponent {

  @Output() statusChange = new EventEmitter<boolean>();
  @Input() status = false;
  
  constructor() { }

/*
   @Input() debounce: number = 0;

  private timeout = null;

  // Toggles the status implementing a simple debouncing trick with timers
  private toggle() {

    // Emits the event only when 'debounce' milliseconds elapsed since the last click
    if(!this.timeout) {
      this.openChange.emit(!this.open); }

    // Clears the timer and restarts it
    clearTimeout(this.timeout);
    this.timeout = setTimeout( () => this.timeout = null, this.debounce );  
  }
*/
}
