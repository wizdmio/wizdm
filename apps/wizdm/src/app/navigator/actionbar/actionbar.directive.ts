import { Directive, OnDestroy, TemplateRef } from '@angular/core';
import { ActionbarService } from './actionbar.service';

@Directive({
  selector: 'ng-template[wmActionbar]'
})
export class ActionbarDirective implements OnDestroy {

  constructor(private actionbar: ActionbarService, template: TemplateRef<any>) { 
    // Transfers the actionbar content when created
    this.actionbar.activate(template);
  }

  // Clears the actionbar when destroyed
  ngOnDestroy() { this.actionbar.clear(); }
}
