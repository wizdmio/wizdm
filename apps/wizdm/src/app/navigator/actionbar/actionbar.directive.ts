import { Directive, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { TeleportService } from '@wizdm/teleport';

/** Teleports the given content towards the 'actionbar' portal witihn the navigator */
@Directive({
  selector: 'ng-template[wmActionbar]'
})
export class ActionbarDirective implements OnInit, OnDestroy {

  @Input() data: any;

  constructor(private teleport: TeleportService, private template: TemplateRef<HTMLElement>) { }

  ngOnInit() {
    // Activates the content towards the 'actionbar' portal
    this.teleport.activate('actionbar', this.template, this.data);
  }

  // Clears the portal content when disposing 
  ngOnDestroy() { this.teleport.clear('actionbar'); }
}
