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

  load: boolean;
  url: string;

  @Input() set src(src: string) {
    this.load = false;
    this.url  = src;
  }

  @Input() alt: string;

  // Avatar color customization 
  @HostBinding('attr.color')
  @Input() color: ThemePalette;
}