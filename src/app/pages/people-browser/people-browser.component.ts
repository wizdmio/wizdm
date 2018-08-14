import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../core';

@Component({
  selector: 'wm-people-browser',
  templateUrl: './people-browser.component.html',
  styleUrls: ['./people-browser.component.scss']
})
export class PeopleBrowserComponent implements OnInit {

  public msgs = null;
  
  constructor(private content: ContentService) {

    // Gets the localized content
    this.msgs = this.content.select('people');
  }

  ngOnInit() {}

}
