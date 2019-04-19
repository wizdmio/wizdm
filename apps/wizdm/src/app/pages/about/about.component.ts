import { Component } from '@angular/core';
import { ContentResolver } from '../../utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  readonly msgs$: Observable<any>;
  
  constructor(content: ContentResolver) {
    // Gets the localized content resolved during routing
    this.msgs$ = content.stream('about'); 
  }
}
