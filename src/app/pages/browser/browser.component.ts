import { Component, OnInit } from '@angular/core';
import { ContentManager } from 'app/core';

@Component({
  selector: 'wm-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {

  private msgs = null;

  constructor(private content: ContentManager) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('browser');
  }
}
