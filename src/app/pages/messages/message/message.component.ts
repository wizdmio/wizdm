import { Component, OnInit, Input } from '@angular/core';
import { wmUserMessage } from 'app/core';

import * as moment from 'moment';

@Component({
  selector: 'wm-user-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() mode: 'view' | 'select' = 'view';

  @Input() disabled = false;

  @Input() message: wmUserMessage;
  
  constructor() {}

  ngOnInit() {}

  public formatDate(date: string): string {
    return moment(date).calendar();
  }
}
