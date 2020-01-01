import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  host: { 'class': 'wm-logo' },
  encapsulation: ViewEncapsulation.None
})
export class LogoComponent {

  //@Input() caption: string;

  // Color customization 
  @HostBinding('attr.color')
  @Input() color: ThemePalette;
}
