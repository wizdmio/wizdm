import { Component, Input } from '@angular/core';

@Component({
  selector: 'wm-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {

  constructor() { }

  @Input() src: string;
  @Input() alt: string;
}
