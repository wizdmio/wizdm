import { Component } from '@angular/core';
import { ContentResolver } from '../../utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  readonly msgs$: Observable<any>;
  
  constructor(content: ContentResolver) {
    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = content.stream('dashboard');
  }
}
