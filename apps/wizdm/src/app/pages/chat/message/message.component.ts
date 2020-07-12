import { UserProfile } from 'app/core/user-profile';
import { Component, Input } from '@angular/core';
import { dbMessage } from '../chat-types';

@Component({
  selector: 'wm-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  host: { 
    "class": "wm-message",
    "[class.in]": "dir === 'in'",
    "[class.out]": "dir === 'out'" }
})
export class ChatMessage {

  @Input() message: dbMessage;

  constructor(private me: UserProfile) {}

  get body(): string {
    return this.message && this.message.body || '';
  }

  get sender(): string {
    return this.message && this.message.sender || ''; 
  }

  get dir(): 'in'|'out' {
    return this.sender === this.me.id ? 'out' : 'in';
  }

  get color() {

    switch(this.dir) {
      case 'in':
      return 'accent';

      case 'out':
      return 'primary';
    }

    return undefined;
  }

  get side() {

    switch(this.dir) {
      case 'in':
      return 'left';

      case 'out':
      return 'right';
    }

    return undefined;
  }
}