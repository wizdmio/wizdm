import { Component, ViewChild } from '@angular/core';
import { RedirectService } from '@wizdm/redirect';
import { SidenavDirective } from 'app/navigator/sidenav';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss'],
  //host: { "style": "flex 1 1 auto" }
})
export class StaticComponent {

  /** The sidenav panel */
  @ViewChild(SidenavDirective) sidenav: SidenavDirective;

  constructor(private redirect: RedirectService) {}

  public navigate(url: string, closeSidenav?: boolean) { 

    console.log('Navigating to:', url)

    // Closes the sidenav panel on request
    if(!!closeSidenav) { this.sidenav?.close(); }
    // Performs the navigation
    return this.redirect.navigate(url);
  }
}
