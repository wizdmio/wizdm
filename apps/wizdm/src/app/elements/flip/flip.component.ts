import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
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

  @Input('flipped') set flipping(value: boolean) { this.flipped = coerceBooleanProperty(value); }
  @HostBinding('@flip') 
  public flipped = false;

  @Output() flippedChange = new EventEmitter<boolean>();
  @HostListener('@flip.done') done() { this.flippedChange.emit(this.flipped); }
}