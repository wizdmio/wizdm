import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, animate, style, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { MatIconRegistry } from '@angular/material';

import { ContentService } from 'app/core';
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
        animate('200ms ease-out', 
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

  constructor(private content: ContentService,
              private icon: MatIconRegistry,
              private router: Router) {}

  private sub: Subscription;
  
  ngOnInit() {

    // Registers font awesome among the available sets of icons for mat-icon component
    this.icon.registerFontClassAlias('fontawesome', 'fa');

    // Subscribes to the ContentService events to  detect language loading
    // showing and hiding the loader accordingly
    this.sub = this.content
                    .events
                    .subscribe( e => {

      // Jumps to the global 'not-found' page in case of loading errors or missing files 
      if(e.reason === 'error') {
        this.router.navigate(['/not-found']);
      }

      // Shows the loader on status 'loading' (hides on 'error' or 'complete') 
      this.loading = e.reason === 'loading';
    });
  }
    
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
