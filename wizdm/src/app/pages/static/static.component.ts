import { Component, ViewChild } from '@angular/core';
import { RedirectService } from '@wizdm/redirect';
import { SidenavDirective } from 'app/navigator/sidenav';
import { TocComponent } from './toc/toc.component';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})
export class StaticComponent {

  /** The sidenav panel */
  @ViewChild(SidenavDirective) sidenav: SidenavDirective;

  /** The TOC component */
  @ViewChild(TocComponent) toc: TocComponent;

  /** Tracks the status of the TOC panel */
  public openTOC: boolean = true;

  constructor(private redirect: RedirectService) {}

  /** Navigates towards the requested url redirecting toc requests when formatted like: 
   * 'toc?go=next' or 'toc?go=prev' for stepping forward or backward within the table 
   * of content respectively */
  public navigate(url: string, closeSidenav?: boolean) { 

    console.log('Navigating to:', url)

    // Closes the sidenav panel on request
    if(!!closeSidenav) { this.sidenav?.close(); }

    // Intercepts TOC requests and redirects the url towards the next/previous page
    const toc = url.match(/.*toc\?go=(next|prev)$/)?.[1];
    if(toc) { url = (toc === 'prev' ? this.toc.previousPage() : this.toc.nextPage())?.link; }
      
    // Performs the navigation
    return this.redirect.navigate(url);
  }
}
