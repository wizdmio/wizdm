import { Component, ViewEncapsulation } from '@angular/core';
import { ContentResolver } from '../../core/content';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'wm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: { 'class': 'wm-footer' }
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

  public redirect(url: string): boolean {
    
    return this.content.navigateByUrl(url), false;
  }
}
