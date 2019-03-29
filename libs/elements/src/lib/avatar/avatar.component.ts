import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
import { $animations } from './avatar.animations';

@Component({
  selector: 'wm-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
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

  @Input() color: ThemePalette;
}