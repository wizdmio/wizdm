import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ContentManager } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';
import { NavigatorService } from './service/navigator.service';
import { $animations } from './navigator.animations';

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
  
  constructor(private content   : ContentManager, 
              private profile   : UserProfile,
              private navigator : NavigatorService,
              private title     : Title,
              private meta      : Meta) {

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

  //-- Error Displaying -----------

  public get error() {
    return this.navigator.error;
  }

  public clearError() {
    this.navigator.clearError();
  }

  //-- Signin status -------------

  public get signedIn(): boolean {
    return this.profile.authenticated;
  }

  public get tbItems(): any[] {
    const tb = this.msgs.toolbar || {};
    return this.signedIn ? tb.private : tb.public;
  }

  public get mnItems(): any[] {
    const mn = this.msgs.menu || {};
    return this.signedIn ? mn.private : mn.public;
  }

  public get userImage(): string {
    return this.profile.data.img;
  }

  //-- Action Buttons -----------

  public get actionButtons() {
    return this.navigator.buttons;
  }

  public clearActions(): void {
    this.navigator.clearActions();
  }

  public performAction(code: string): void {
    this.navigator.performAction(code);
  }
}
