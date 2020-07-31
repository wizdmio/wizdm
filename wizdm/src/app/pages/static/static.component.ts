import { Component, ViewChild } from '@angular/core';
import { RedirectService } from '@wizdm/redirect';
import { SidenavDirective } from 'app/navigator/sidenav';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})
export class StaticComponent {

  /** The sidenav panel */
  @ViewChild(SidenavDirective) sidenav: SidenavDirective;

  public openTOC: boolean = true;

  constructor(private redirect: RedirectService) {}

  public navigate(url: string, closeSidenav?: boolean) { 

    console.log('Navigating to:', url)

    // Closes the sidenav panel on request
    if(!!closeSidenav) { this.sidenav?.close(); }
    // Performs the navigation
    return this.redirect.navigate(url);
  }
}
