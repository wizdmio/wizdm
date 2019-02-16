import { Component, OnInit } from '@angular/core';
import { ContentManager } from '@wizdm/content';

@Component({
  selector: 'wm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public msgs = null;
  
  constructor(private content: ContentManager) {
    // Gets the localized content
    this.msgs = this.content.select('home');
  }

  ngOnInit() {
  }

}
