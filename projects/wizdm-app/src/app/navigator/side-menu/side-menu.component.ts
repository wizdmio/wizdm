import { Component, Input } from '@angular/core';
import { ContentManager } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';

@Component({
  selector: 'wm-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  public menu;

  constructor(private content: ContentManager, private profile: UserProfile) { 

    // Gets the localized menu content
    this.menu = this.content.select("navigator.menu");
  }

  @Input() signedIn: boolean = false;
}
