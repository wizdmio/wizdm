import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { trigger, animate, style, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { MatIconRegistry } from '@angular/material';

import { ContentManager, LanguageData } from 'app/content';
import { Subscription } from 'rxjs';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>' + 
            '<div *ngIf="loading" class="preloader" @fade>' + 
              '<div></div><div></div><div></div>' +
            '</div>',
  styles: [], 
  animations: [
    trigger('fade', [
      transition(':leave', [
        animate('500ms ease-out', 
          style({ opacity: 0 })
        )] 
      )
    ])
  ]
  //templateUrl: './app.component.html',
  //styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy { 
  
  private loading: boolean = true;

  constructor(private content: ContentManager,
              private icon: MatIconRegistry,
              private router: Router) {}

  private sub: Subscription;
  
  ngOnInit() {

    // Registers font awesome among the available sets of icons for mat-icon component
    this.icon.registerFontClassAlias('fontawesome', 'fa');

    // Instruct the content manager re-routing to the 'not-found' page
    // in case of loading errors or missing files 
    this.content.setDefault( (deflang: LanguageData) => { this.router.navigate(['/not-found']);} );

    // Subscribes to the ContentManager events to  detect language loading
    // showing and hiding the loader accordingly
    this.sub = this.content
                    .events
                    .subscribe( e => {

      // Shows the loader on status 'loading' (hides on 'error' or 'complete') 
      this.loading = e.reason === 'loading';
    });
  }
    
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
