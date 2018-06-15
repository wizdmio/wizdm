import { Component, Input } from '@angular/core';
import { togglerAnimations } from './toggler-animations';

@Component({
  selector: 'wm-toggler',
  templateUrl: './toggler.component.html',
  styleUrls: ['./toggler.component.scss'],
  animations: togglerAnimations
})
export class TogglerComponent {

  @Input() status = false;
  
  constructor() { }
}
