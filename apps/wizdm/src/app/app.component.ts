import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, animate, style, transition } from '@angular/animations';
import { Router, ResolveStart, ResolveEnd } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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

  constructor(private router: Router, private icon: MatIconRegistry) {}

  private sub: Subscription;
  
  ngOnInit() {

    // Registers font awesome among the available sets of icons for mat-icon component
    this.icon.registerFontClassAlias('fontawesome', 'fa');

    // Subscribes to the ContentManager events to  detect language loading
    // showing and hiding the loader accordingly
    this.sub = this.router.events
      .pipe( 
        // Filters Resolve events only
        filter( e => e instanceof ResolveStart || e instanceof ResolveEnd), 
        // Maps the event into true/false
        map( e => e instanceof ResolveStart)
        // Shows the loader spinner while resolving the route content
      ).subscribe( e => this.loading = e );
  }
    
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
