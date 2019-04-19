import { Component } from '@angular/core';
import { ContentResolver } from '../../utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent {

  readonly msgs$: Observable<any>;

  constructor(content: ContentResolver) { 
    // Gets the localized content
    this.msgs$ = content.stream('comingSoon');
  }
}