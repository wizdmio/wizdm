import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RedirectService } from '@wizdm/redirect';
import { SidenavDirective } from 'app/navigator/sidenav';
import { resolvePath } from './static-resolver.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TocItem } from './toc';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  //host: { "style": "flex 1 1 auto" }
})
export class StaticComponent {

  /** The sidenav panel */
  @ViewChild(SidenavDirective) sidenav: SidenavDirective;

  readonly path$: Observable<string>;

  constructor(private redirect: RedirectService, route: ActivatedRoute) {

    // Resolves the requested page
    this.path$ = route.paramMap.pipe( map( params => resolvePath(params) ) );
  }

  public navigate(url: string, closeSidenav?: boolean) { 

    console.log('Navigating to:', url)

    // Closes the sidenav panel on request
    if(!!closeSidenav) { this.sidenav?.close(); }
    // Performs the navigation
    return this.redirect.navigate(url);
  }
}
