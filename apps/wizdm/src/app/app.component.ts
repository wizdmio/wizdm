import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { trigger, animate, style, transition } from '@angular/animations';
import { Router, ResolveStart, NavigationEnd } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [
      transition(':leave', [
        animate('200ms ease-out', 
          style({ opacity: 0 })
        )] 
      )
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy { 
  
  public loading: boolean = true;
  private sub: Subscription;

  constructor(private router: Router, private icon: MatIconRegistry) {}
  
  ngOnInit() {

    // Registers font awesome among the available sets of icons for mat-icon component
    this.icon.registerFontClassAlias('fontawesome', 'fa');

    // Intercepts router events...
    this.sub = this.router.events.subscribe( e => {

      // Enable the loading spinner during content resolving
      if( e instanceof ResolveStart ) { this.loading = true; }

      // Disables the loading spinner every end of navigation
      if( e instanceof NavigationEnd ) { this.loading = false; }      
    });
  }
    
  ngOnDestroy() { this.sub.unsubscribe(); }
}
