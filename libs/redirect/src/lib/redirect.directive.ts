import { Directive, Input, HostBinding, HostListener } from '@angular/core';
import { RedirectService } from './redirect.service';

@Directive({
  selector: ':not(a):not(area)[wmRedirect]'
})
export class RedirectDirective {

  constructor(readonly redirect: RedirectService) { }

  @Input('wmRedirect') url: string;

  @HostListener('click') onClick() {
    // Fallbakcs to default if no url is specified
    if(!this.url) { return true; }
    // Navigates on the requested link redirecting when necessary
    this.redirect.navigate(this.url);
    // Prevents default
    return false;
  }
}

@Directive({
  selector: 'a[wmRedirect],area[wmRedirect]'
})
export class RedirectWithHrefDirective extends RedirectDirective {

  constructor(redirect: RedirectService) { 
    super(redirect);
  }

   // Binds the requested url to the href property
  @HostBinding('href') get href() { return this.url; }
}