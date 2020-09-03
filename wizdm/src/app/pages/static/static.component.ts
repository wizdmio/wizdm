import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RedirectService } from '@wizdm/redirect';
import { StaticContent } from './static-resolver.service';
import { TocComponent, TocItem } from './toc/toc.component';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})
export class StaticComponent {

  /** The TOC component */
  @ViewChild(TocComponent) toc: TocComponent;

  /** Static content observables  */
  readonly path$: Observable<string>;
  readonly body$: Observable<string>;

  /** Tracks the status of the TOC panel */
  public openTOC: boolean = true;
  public tocItem: TocItem;

  constructor(private redirect: RedirectService, route: ActivatedRoute) {

    // Extracts the path$ observable from the resolved static data
    this.path$ = route.data.pipe( map( data => (data.document as StaticContent)?.path || '') );

    // Extracts the body$ observable from the resolved static data
    this.body$ = route.data.pipe( map( data => (data.document as StaticContent)?.body || '') );
  }

  // Tracks the toc changes
  public tocChanged(item: TocItem, mobile?: boolean) {

    // Force closing the toc panel while navigating on small screens or no iem is null (aka the current document isn't referred within the toc)
    if(mobile || !item) { this.openTOC = false; }

    // Force opening the toc panel whenever display a document referred within the toc for the first time
    else if(!this.tocItem) { this.openTOC = true; }

    // Keep track of the current toc item.
    this.tocItem = item;
  }

  /** Navigates towards the requested url redirecting toc requests when formatted like: 
   * 'toc?go=next' or 'toc?go=prev' for stepping forward or backward within the table 
   * of content respectively */
  public navigate(url: string) { 

    // Intercepts TOC requests and redirects the url towards the next/previous page
    const toc = url.match(/.*toc\?go=(next|prev)$/)?.[1];
    if(toc) { url = (toc === 'prev' ? this.toc.previousPage() : this.toc.nextPage())?.link; }

    console.log('Navigating to:', url)
      
    // Performs the navigation
    return this.redirect.navigate(url);
  }
}
