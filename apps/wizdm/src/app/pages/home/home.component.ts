import { Component, OnInit } from '@angular/core';
import { ContentManager } from '@wizdm/content';
import { NavigatorService } from '../../navigator';
import { $animations } from './home.animations';

@Component({
  selector: 'wm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: $animations
})
export class HomeComponent {

  public msgs = null;
  
  constructor(private content: ContentManager, readonly nav: NavigatorService) {
    // Gets the localized content
    this.msgs = this.content.select('home');
  }
}
