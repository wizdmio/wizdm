import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ContentService, AuthService } from '../../core';
import { toolbarAnimations } from './toolbar-animations';
import { Subscription } from 'rxjs';

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
  private sub: Subscription;

  constructor(private content: ContentService,
              private auth: AuthService,
              private router: Router) { }

    ngOnInit() {

      // Gets the localized content
      this.msgs = this.content.select("navigator");
    
      // Listen for NavigationEnd events to close the menu
      this.sub = this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe( (value: NavigationEnd) => {

          // Closes the sidenav drawer after navigation
          if(this.toggler) {
            this.toggle();
          }
        });
    }

    ngOnDestroy() {
      this.sub.unsubscribe();
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
