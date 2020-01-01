import { Directive, TemplateRef } from '@angular/core';
import { ActionbarService } from './actionbar.service';

@Directive({
  selector: '[wmActionbar]'
})
export class ActionbarDirective {

  constructor(private actionbar: ActionbarService, template: TemplateRef<any>) { 

    this.actionbar.activate(template);
  }
}
