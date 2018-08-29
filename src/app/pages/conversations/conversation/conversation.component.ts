import { Component, OnInit, Input, Inject } from '@angular/core';
import { USER_PROFILE, wmConversation, wmMessage, wmUser } from 'app/core';

import * as moment from 'moment';

@Component({
  selector: 'wm-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  @Input() message: wmConversation;
  
  constructor(@Inject(USER_PROFILE) public profile: wmUser) {}

  ngOnInit() {

    

  }

  public formatDate(date: string): string {
    return moment(date).calendar();
  }
}
