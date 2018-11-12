import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ContentManager } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';
import { NavigatorService, wmAction } from './navigator.service';
import { $animations } from './navigator.animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  animations: $animations
})
export class NavComponent implements OnInit {

  public msgs: any = null;
  public scrolled = false;
  public menu = false;
  
  constructor(private content : ContentManager, 
              private profile : UserProfile,
              private service : NavigatorService,
              private title   : Title,
              private meta    : Meta) {

    // Gets the localized content
    this.msgs = this.content.select("navigator"); 
  }

  ngOnInit() { 

    // Sets the app title when defined 
    if(this.msgs.title) {
      this.title.setTitle(this.msgs.title);}

    // Update the description meta-tag
    if(this.msgs.description) {
      this.meta.updateTag({content: this.msgs.description}, "name='description'");
    }
  }

  //-- Signin status -------------

  public get signedIn(): boolean {
    return this.profile.authenticated || false;
  }

  public get desktopMenu(): any[] {
    const menu = this.msgs.toolbar || {};
    return this.signedIn ? menu.private : menu.public;
  }

  public get mobileMenu(): any[] {
    const menu = this.msgs.menu || {};
    return this.signedIn ? menu.private : menu.public;
  }

  public get userImage(): string {
    return this.profile.data.img;
  }

  // -- Toolbar Actions -------
  public get actionButtons$(): Observable<wmAction[]> {
    return this.service.toolbar.buttons$;
  }

  public get someActions$(): Observable<boolean> {
    return this.service.toolbar.some$;
  }

  public clearActions(): void {
    this.service.toolbar.clearActions();
  }
}
