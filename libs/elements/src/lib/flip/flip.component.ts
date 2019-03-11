import { Component, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { $animations } from './flip.animations';

@Component({
  selector: 'wm-flip',
  templateUrl: './flip.component.html',
  styleUrls: ['./flip.component.scss'],
  animations: $animations
})
export class FlipComponent {

  @Input() flip = false;

  @HostBinding('@flip') get trigger() {
    return this.flip;
  }

  @Output() flipped = new EventEmitter<boolean>();

  @HostListener('@flip.done') done() {
    this.flipped.emit(this.flip);
  }
}