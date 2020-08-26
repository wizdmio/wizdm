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
  public prefix: string;
  public suffix: string;

  /** Theme color */ 
  @Input() color: ThemePalette = 'primary';

  /** Logo size in pixels */
  @Input() size: number;

  /** Caption. It wraps around the logo. Use :wizdm: to place the logo within the text */
  @Input() set caption(text: string) {
    
    // Splits the text in prefix/suffix
    const [prefix, suffix] = (text || '').split(':wizdm:');

    // Prefix works only when there's a suffix.
    this.prefix = suffix ? prefix : suffix;
    // Single text defaults to become suffix only
    this.suffix = suffix || prefix;
  }

  /** Logo image to be used as alternative to the default Wizdm logo */
  @Input() src: string;

  /** Automatically adjust the size to the font height */
  @Input('inline') set inlining(inline: boolean) {
    this.inline = coerceBooleanProperty(inline);
  }

  /** Runs the spinning animation */
  @Input('animate') set runAnimation(animate: boolean) {
    this.animate = coerceBooleanProperty(animate);
  }
}
