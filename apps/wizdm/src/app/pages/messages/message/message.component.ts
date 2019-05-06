import { Component, OnInit, Input } from '@angular/core';
import { wmMessage } from '../../../core';
import * as moment from 'moment';

@Component({
  selector: 'wm-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: wmMessage;
  
  constructor() {}

  ngOnInit() {

    

  }

  public formatDate(date: string): string {
    return moment(date).calendar();
  }
}
