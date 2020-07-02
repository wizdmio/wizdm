import { NgModule } from '@angular/core';
import { RedirectDirective, RedirectWithHrefDirective } from './redirect.directive';

@NgModule({
  imports: [],
  declarations: [ RedirectDirective, RedirectWithHrefDirective ],
  exports: [ RedirectDirective, RedirectWithHrefDirective ]
})
export class RedirectModule { }