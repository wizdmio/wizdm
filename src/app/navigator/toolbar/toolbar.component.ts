import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContentManager } from 'app/core';

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
  @Input()  signedIn = false;

  private menu: any = null;
  private sub: Subscription;
  
  constructor(private content: ContentManager,
              private router: Router) { }

    ngOnInit() {

      // Gets the localized content
      this.menu = this.content.select("navigator.menu");
    
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

    private toggle() {
      this.togglerChange.emit(this.toggler = !this.toggler);
    }
}
