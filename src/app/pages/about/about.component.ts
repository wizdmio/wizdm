import { Component, OnInit } from '@angular/core';
import { ContentManager } from 'app/core';

@Component({
  selector: 'wm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  private msgs = null;
  
  constructor(private content: ContentManager) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('about');
  }
}
