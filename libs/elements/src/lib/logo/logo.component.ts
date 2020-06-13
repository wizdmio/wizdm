import { Component, Input, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'], 
  host: { 
    'class': 'wm-logo',
    '[attr.color]': 'color',
    '[attr.inline]': 'inline',
    '[class.animate]': 'animate'
  },
  encapsulation: ViewEncapsulation.None
})
export class LogoComponent {

  public animate: boolean
  public inline: boolean;

  /** Theme color */ 
  @Input() color: ThemePalette = 'primary';

  /** Automatically adjust the size to the font height */
  @Input('inline') set inlining(inline: boolean) {
    this.inline = coerceBooleanProperty(inline);
  }

  /** Runs the spinning animation */
  @Input('animate') set runAnimation(animate: boolean) {
    this.animate = coerceBooleanProperty(animate);
  }
}
