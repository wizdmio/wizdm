import { NgModule } from '@angular/core';
import { ContentDirective, ContentDirectiveWithHref } from './content.directive';

@NgModule({
  declarations: [ ContentDirective, ContentDirectiveWithHref ],
  exports: [ ContentDirective, ContentDirectiveWithHref ]
})
export class ContentModule { }