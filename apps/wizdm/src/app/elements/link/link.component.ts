import { Component, Input, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-link, [wm-link]',
  template: '<ng-content></ng-content>',
  host: { 'class': 'wm-link' }
})
export class LinkComponent {

  // Color customization 
  @HostBinding('attr.color')
  @Input() color: ThemePalette;

  @Input('disabled') set disabling(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  @HostBinding('attr.disabled')
  public disabled = false;
}