import { Directive, TemplateRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { TeleportService } from '@wizdm/teleport';

export interface FabOptions {
  direction?: 'row'|'column';
}

/** Teleports the content into one of the fab portal corners */
@Directive({
  selector: 'ng-template[wmFab]'
})
export class FabDirective implements OnInit, OnChanges, OnDestroy {

  constructor(private teleport: TeleportService, private template: TemplateRef<any>) { }

  /** The flex direction for the fab container */
  @Input() direction: 'row'|'column' = 'row';

  /** The side of the portal to activate */
  @Input() side: 'left'|'right';

  /** The edge of the portal to activate */
  @Input() edge: 'top'|'bottom';

  ngOnInit() { 

    // Applies default values whenever needed
    this.side = this.side || 'right';
    this.edge = this.edge || 'bottom';

    // Activates the requested portal
    this.teleport.activate(`fab-${this.side}-${this.edge}`, this.template, {
      direction: this.direction
    } as FabOptions);
  }

  ngOnChanges(changes: SimpleChanges) { 

    const prevSide = changes.side?.previousValue;
    const newSide = changes.side?.currentValue || 'right';

    const prevEdge = changes.edge?.previousValue;
    const newEdge = changes.edge?.currentValue || 'bottom';

    // Deactivates the previous portal, if any
    if(prevSide && prevEdge) { this.teleport.clear(`fab-${prevSide}-${prevEdge}`); }

    // Activates/updates the requested portal
    this.teleport.activate(`fab-${newSide}-${newEdge}`, this.template, {
      direction: this.direction
    } as FabOptions);
  }

  // Releases the portal when done
  ngOnDestroy() { this.teleport.clear(`fab-${this.side}-${this.edge}`); }
}
