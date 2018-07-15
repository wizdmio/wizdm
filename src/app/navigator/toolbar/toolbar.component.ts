import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContentService, AuthService } from '../../core';
import { toolbarAnimations } from './toolbar-animations';

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
  //@Input()  signedIn = false;

  private msgs: any = null;
  private sub: Subscription;

  constructor(private content: ContentService,
              private auth: AuthService,
              private router: Router) { }

    ngOnInit() {

      // Gets the localized content
      this.msgs = this.content.select("navigator");
    
      // Listen for NavigationEnd events to close the menu
      this.sub = this.router
      .events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe( (value: NavigationEnd) => {

        // Closes the sidenav drawer after navigation
        if(this.toggler) {
          this.toggle();
        }
      });
    }

    ngOnDestroy() {
      if(this.sub) {
        this.sub.unsubscribe();
      }
    }

    get signedIn(): boolean {
      return this.auth.authenticated;
    }

    get userImage(): string {

      if(!this.auth.userProfile) {
        return this.msgs.user.avatar; 
      }

      return this.auth.userProfile.img || 
             this.msgs.user.avatar;
    }
    
    private toggle() {
      this.togglerChange.emit(this.toggler = !this.toggler);
    }
}
