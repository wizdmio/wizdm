import { Component } from '@angular/core';
import { NavigatorService } from '../../navigator';
import { ContentResolver } from '../../core';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: { 'class': 'wm-page adjust-top' }
})
export class HomeComponent {

  readonly msgs$: Observable<any>;
  
  constructor(readonly content: ContentResolver, readonly nav: NavigatorService) {
    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = content.stream('home');
  }
}
