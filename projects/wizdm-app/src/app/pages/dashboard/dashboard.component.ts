import { Component, OnInit } from '@angular/core';
import { ContentManager } from '@wizdm/content';

@Component({
  selector: 'wm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public msgs = null;
  
  constructor(private content: ContentManager) {
    // Gets the localized content
    this.msgs = this.content.select('dashboard');
  }

  ngOnInit() {
  }

}
