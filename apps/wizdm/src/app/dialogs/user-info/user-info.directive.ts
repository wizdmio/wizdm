import { Directive, Input, HostBinding, HostListener } from '@angular/core';
import { UserInfoComponent } from './user-info.component';

@Directive({
  selector: '[wmMemberInfoTrigger]'
})
export class UserInfoDirective {

  @Input('wmMemberInfoTrigger') info: UserInfoComponent;

  // Applies the 'cursor: pointer' style to the host component
  @HostBinding('style.cursor') cursor = 'pointer';

  // Shows the user info popup dialog on click
  @HostListener('click') onClick() {

    if(!!this.info) {
      this.info.show();
    }
  }
}
