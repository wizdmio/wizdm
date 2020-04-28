import { NgModule } from '@angular/core';
import { ActionLinkDirective } from './action-link.directive';
import { ActionLinkObserver } from './action-link.service';

@NgModule({
  declarations: [ ActionLinkDirective ],
  exports: [ ActionLinkDirective ]
})
export class ActionLinkModule { }
