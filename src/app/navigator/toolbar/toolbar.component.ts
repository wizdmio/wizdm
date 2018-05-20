import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ContentManager, LanguageData } from 'app/content';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'wm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Output() togglerChange = new EventEmitter<boolean>();
  @Input() toggler = false;

  private languages: LanguageData[];
  private language: LanguageData;
  private menu: any = null;

  private sub: Subscription;
  
  constructor(private content: ContentManager,
              private router: Router) { }

    ngOnInit() {

      // Gets the localized content
      this.menu = this.content.select("navigator.menu");
    
      // Gets the list of available languages
      this.languages = this.content.languages();
      this.language = this.content.language();

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
