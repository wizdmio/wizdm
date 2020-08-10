import { Directive, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { TeleportService } from '@wizdm/teleport';

@Directive({
  selector: 'ng-template[wmFooter]'
})
export class StickyFooterDirective implements OnInit, OnDestroy {

  constructor(private teleport: TeleportService, private template: TemplateRef<any>) { }

  // Teleports the template to the 'footer' portal
  ngOnInit() { this.teleport.activate('footer', this.template); }

  // Clears the 'footer' portal
  ngOnDestroy() { this.teleport.clear('footer', this.template); }
}
