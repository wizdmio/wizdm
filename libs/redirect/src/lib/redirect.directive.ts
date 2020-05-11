import { Directive, Input, HostBinding, HostListener } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { RedirectService } from './redirect.service';

@Directive({
  selector: ':not(a):not(area)[wmRedirect]'
})
export class RedirectDirective {

  constructor(readonly redirect: RedirectService) { }

  @Input('wmRedirect') url: string;

  /** */
  @Input('disabled') set disable(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled: boolean = false;

  @HostListener('click') onClick() {
    // Skips when disabled
    if(this.disabled) { return false; }
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