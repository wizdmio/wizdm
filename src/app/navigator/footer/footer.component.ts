import { Component, OnInit } from '@angular/core';
import { ContentManager } from 'app/content';

@Component({
  selector: 'wm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private msgs;

  constructor(private content: ContentManager) {}

  ngOnInit() {

    // Gets the localized user messages from content service
    this.msgs = this.content.select('navigator.footer');
  }
}
