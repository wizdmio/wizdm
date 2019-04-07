import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { NavigatorService } from '../../navigator';
import { $animations } from './home.animations';

@Component({
  selector: 'wm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: $animations
})
export class HomeComponent {

  readonly msgs = null;
  
  constructor(route: ActivatedRoute, readonly nav: NavigatorService) {
    // Gets the localized content pre-fetched during routing resolving
    this.msgs = route.snapshot.data.content.home || {};
  }
}
