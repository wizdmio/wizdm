import { Component, ElementRef, NgZone } from '@angular/core';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: '[wm-footer]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']/*,
  host: { 'class': 'wm-footer' }*/
})
export class FooterComponent {

  /** Media-like observable */
  readonly xsmall$: Observable<boolean>;

  /** Host element */
  private get element(): HTMLElement { return this.elref.nativeElement; }

  constructor(private elref: ElementRef<HTMLElement>, private router: Router, zone: NgZone) {

    /** Media-match like value based on the element's width instead of the viewport's. 
     * Since the footer is squeezed by the sidenav, we better consider the available 
     * remaining space rather then the screen width */
    this.xsmall$ = zone.onStable.pipe( map(() => (this.element?.clientWidth || 0) <= 599 ), distinctUntilChanged() );
    // NOTE: we're using NgZone.onStable to make sure the element's width is "sampled" when the rendering has been completed
    // to avoid raising the valueChangedAfterItHasBeenChecked() exception
  }

  public languageLink(lang: string): any[] {
    // Splits the current url removing query parameters, if any
    // Parameters will be eventaully preserved by the routerLink directive
    const cmds = this.router.url.replace(/\?.*$/, '')?.split('/');
    // Makes sure its absolute
    cmds[0] = '/';
    // Overwrites the language
    cmds[1] = lang;

    return cmds;
  }
}
