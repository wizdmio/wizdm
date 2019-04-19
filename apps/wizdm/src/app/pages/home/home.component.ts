import { Component } from '@angular/core';
import { NavigatorService } from '../../navigator';
import { ContentResolver } from '../../utils';
import { Observable } from 'rxjs';
import { $animations } from './home.animations';

@Component({
  selector: 'wm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: $animations
})
export class HomeComponent {

  readonly msgs$: Observable<any>;
  
  constructor(content: ContentResolver, readonly nav: NavigatorService) {
    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = content.stream('home');
  }
}
