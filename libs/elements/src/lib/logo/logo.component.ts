import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  host: { 'class': 'wm-logo' },
  encapsulation: ViewEncapsulation.None
})
export class LogoComponent {

  // Color customization 
  @HostBinding('attr.color')
  @Input() color: ThemePalette = 'primary';

  /** Inlines the logo so the height automatically adapts to the font size */
  @Input() inline: boolean;
  @HostBinding('attr.inline') get inlineAttr() { 
    return coerceBooleanProperty(this.inline);
  }
}
