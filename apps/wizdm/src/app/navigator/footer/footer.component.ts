import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: { 'class': 'wm-footer' }
})
export class FooterComponent {

  readonly year = (new Date()).getFullYear();
  
  constructor(private router: Router) {}

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
