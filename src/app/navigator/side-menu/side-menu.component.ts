import { Component, Input } from '@angular/core';
import { ContentService, UserProfile } from 'app/core';

@Component({
  selector: 'wm-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  public menu;

  constructor(private content: ContentService, private profile: UserProfile) { 

    // Gets the localized menu content
    this.menu = this.content.select("navigator.menu");
  }

  @Input() signedIn: boolean = false;
}
