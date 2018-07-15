import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../core';

@Component({
  selector: 'wm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  private msgs = null;
  
  constructor(private content: ContentService) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('about');
  }
}
