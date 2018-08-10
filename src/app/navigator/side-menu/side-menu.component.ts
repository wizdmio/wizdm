import { Component, OnInit } from '@angular/core';
import { ContentService, AuthService } from 'app/core';

@Component({
  selector: 'wm-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  public menu;

  constructor(private content: ContentService, 
              private auth: AuthService,) { }

  ngOnInit() {

    // Gets the localized menu content
    this.menu = this.content.select("navigator.menu");
   
  }

  public get signedIn(): boolean {
    return this.auth.authenticated;
  }
}
