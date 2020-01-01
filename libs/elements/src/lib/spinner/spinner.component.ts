import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  host: { 'class': 'wm-spinner' },
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent {

  // Color customization 
  @HostBinding('attr.color')
  @Input() color: ThemePalette = 'accent';

  @HostBinding('style.width.px')
  @Input() size: number;

  @Input() strokeWidth: number;
}