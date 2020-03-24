import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RedirectService } from '@wizdm/redirect';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  //host: { "style": "flex 1 1 auto" }
})
export class StaticComponent {

  readonly page$: Observable<string>;

  constructor(readonly redirect: RedirectService, route: ActivatedRoute) {

    // Resolve the requested page to be used with gtag directive
    this.page$ = route.paramMap.pipe( map( params => params && params.get('page') || '') );
  }
}
