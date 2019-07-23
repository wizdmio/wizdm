import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';
import { $animations } from './flip.animations';

@Component({
  selector: 'wm-flip',
  templateUrl: './flip.component.html',
  styleUrls: ['./flip.component.scss'],
  host: { class: 'wm-flip' },
  encapsulation: ViewEncapsulation.None,
  animations: $animations
})
export class FlipComponent {

  @HostBinding('@flip')
  @Input() flip = false;

  @Output() flipped = new EventEmitter<boolean>();

  @HostListener('@flip.done') done() {
    this.flipped.emit(this.flip);
  }
}