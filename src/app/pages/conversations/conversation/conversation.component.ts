import { Component, OnInit, Input } from '@angular/core';
import { wmConversation, wmMessage } from 'app/core';

import * as moment from 'moment';

@Component({
  selector: 'wm-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  @Input() message: wmConversation;
  
  constructor() {}

  ngOnInit() {}

  public formatDate(date: string): string {
    return moment(date).calendar();
  }
}
