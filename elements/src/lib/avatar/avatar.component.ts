import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
import { $animations } from './avatar.animations';

@Component({
  selector: 'wm-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  host: { class: 'wm-avatar' },
  encapsulation: ViewEncapsulation.None,
  animations: $animations
})
export class AvatarComponent {

  public load: boolean;
  public url: string;

  /** The source url */
  @Input() set src(src: string) {
    this.load = false;
    this.url = src;
  }

  /** The alt input */
  @Input() alt: string;

  /** The color theme palette */
  @HostBinding('attr.color')
  @Input() color: ThemePalette;

  /** The avatar shape */
  @HostBinding('attr.shape')
  @Input() shape: 'rounded'|'squared' = 'rounded';
}