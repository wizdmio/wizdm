import { Directive, TemplateRef, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { TeleportService } from '@wizdm/teleport';

export interface FabOptions {
  direction?: 'row'|'column';
  side?: 'left'|'right';
  edge?: 'top'|'bottom';
}

@Directive({
  selector: 'ng-template[wmFab]'
})
export class FabDirective implements OnInit, OnChanges, OnDestroy {

  constructor(private teleport: TeleportService, private template: TemplateRef<any>) { }

  @Input() direction: 'row'|'column' = 'row';

  @Input() side: 'left'|'right' = 'right';

  @Input() edge: 'top'|'bottom' = 'bottom';

  ngOnInit() { this.activate(); }

  ngOnChanges() { this.activate(); }

  ngOnDestroy() { this.teleport.clear('fab'); }

  private activate() {

    this.teleport.activate('fab', this.template, {
      direction: this.direction,
      side: this.side,
      edge: this.edge
    } as FabOptions);
  }
}
