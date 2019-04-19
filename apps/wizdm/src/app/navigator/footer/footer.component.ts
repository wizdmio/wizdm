import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { ContentResolver } from '../../utils';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'wm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  
  readonly msgs$: Observable<any>;
  
  constructor(readonly content: ContentResolver) {

    // Gets the localized content pre-fetched by the resolver during routing
    this.msgs$ = content.stream("navigator.footer");
  }

  readonly year = (new Date()).getFullYear();

  copyright(msg: string): string {

    // Interpolates the copyright message to dynamically change the current year
    return msg.interpolate(this);
  }
}
