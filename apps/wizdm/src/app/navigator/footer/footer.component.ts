import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'footer[wm-footer]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']/*,
  host: { 'class': 'wm-footer' }*/
})
export class FooterComponent {

  readonly year = (new Date()).getFullYear();

  /** Host element */
  private get element(): HTMLElement { return this.elref.nativeElement; }

  /** Media-match like value based on the element's with instead of the viewport's. 
   * Since the footer is squeezed by the sidenav, we better consider the available 
   * width rather then the screens */
  get xsmall(): boolean { return (this.element?.clientWidth || 0) <= 599; }
  
  constructor(private elref: ElementRef<HTMLElement>, private router: Router) {}

  copyright(msg: string): string {
    // Interpolates the copyright message to dynamically change the current year
    return msg.interpolate(this);
  }

  public languageLink(lang: string): any[] {
    // Splits the current url
    const cmds = this.router.url.split('/');
    // Makes sure its absolute
    cmds[0] = '/';
    // Overwrites the language
    cmds[1] = lang;
    return cmds;
  }
}
