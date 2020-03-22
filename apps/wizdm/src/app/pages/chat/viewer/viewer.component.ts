import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-chat-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ChatViewer {

  constructor() { }

  @Input() messages: string[];

}
