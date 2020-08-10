import { Directive, OnInit, OnChanges, SimpleChanges, OnDestroy, Input, TemplateRef } from '@angular/core';
import { TeleportService } from '@wizdm/teleport';

/** Teleports the given content towards the 'actionbar' portal witihn the navigator */
@Directive({
  selector: 'ng-template[wmActionbar]',
  exportAs: 'wmActionbar'
})
export class ActionbarDirective implements OnInit, OnChanges, OnDestroy {

  @Input() data: any;

  constructor(private teleport: TeleportService, private template: TemplateRef<HTMLElement>) { }

  // Activates the content towards the 'actionbar' portal with the given optional data
  public activate(data?: any) {
    // NOTE: Activating the same template with different data do not renders the content again
    this.teleport.activate('actionbar', this.template, this.data = data);
  }

  ngOnInit() {
    // Teleports the contents whithout data
    if(!this.data) { this.activate(); }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Teleports the content with the given data
    this.activate(changes.data.currentValue);
  }

  // Clears the portal content when disposing 
  ngOnDestroy() { this.teleport.clear('actionbar', this.template); }
}
