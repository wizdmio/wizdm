import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ContentService, AuthService } from 'app/core';
import { ToolbarService } from './toolbar.service';
import { toolbarAnimations } from './toolbar-animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'wm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: toolbarAnimations
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Output() togglerChange = new EventEmitter<boolean>();
  @Input()  toggler = false;
  @Input()  divider = false;
  
  public msgs: any = null;

  constructor(private content : ContentService,
              private toolbar : ToolbarService,
              private auth    : AuthService,
              private router  : Router) { }

    ngOnInit() {

      // Gets the localized content
      this.msgs = this.content.select("navigator");
    
      // Listen for NavigationEnd events to close the menu
      this.router.events.pipe( filter(e => e instanceof NavigationStart) )
        .subscribe( () => {
          // Clears the action buttons when navigating to a new page
          this.toolbar.clearActions();
          // Closes the sidenav drawer after navigation, eventually
          if(this.toggler) { this.toggle();}
        });
    }

    ngOnDestroy() {}

    public get actionButtons() {
      return this.toolbar.buttons;
    }

    public get someAction() {
      return this.actionButtons.length > 0;
    }

    public performAction(code: string) {
      this.toolbar.performAction(code);
    }

    public get signedIn(): boolean {
      return this.auth.authenticated;
    }

    public get userImage(): string {

      return this.auth.userProfile ? 
        this.auth.userProfile.img : null; 
    }
    
    public toggle() {
      this.togglerChange.emit(this.toggler = !this.toggler);
    }
}
