import { Directive, TemplateRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { TeleportService } from '@wizdm/teleport';

export interface FabOptions {
  direction?: 'row'|'column';
  align?: string;
  gap?: string;
}

/** Teleports the content into one of the fab portal corners */
@Directive({
  selector: 'ng-template[wmFab]'
})
export class FabDirective implements OnInit, OnChanges, OnDestroy {

  constructor(private teleport: TeleportService, private template: TemplateRef<any>) { }

  /** The flex direction for the fab container */
  @Input() direction: 'row'|'column' = 'row';

  /** The flex alignement */
  @Input() align: string;

  /** The flex gap */
  @Input() gap: string;

  /** The side of the portal to activate */
  @Input() side: 'left'|'right';

  /** The edge of the portal to activate */
  @Input() edge: 'top'|'bottom';

  /** Override the side/edge */
  @Input() set wmFab(target: string) {

    const [side, edge] = target?.split(/\s+/) as ['left'|'right', 'top'|'bottom'];

    // Applies default values whenever needed
    this.side = side || 'right';
    this.edge = edge || 'bottom';
  }

  ngOnInit() { 

    // Applies default values whenever needed
    this.side = this.side || 'right';
    this.edge = this.edge || 'bottom';

    // Activates the requested portal
    this.teleport.activate(`fab-${this.side}-${this.edge}`, this.template, {
      direction: this.direction,
      align: this.align,
      gap: this.gap
    } as FabOptions);
  }

  ngOnChanges(changes: SimpleChanges) { 

    const prevSide = changes.side?.previousValue;
    const newSide = this.side || 'right';

    const prevEdge = changes.edge?.previousValue;
    const newEdge = this.edge || 'bottom';

    // Deactivates the previous portal, if any
    if(prevSide && prevEdge) { this.teleport.clear(`fab-${prevSide}-${prevEdge}`, this.template); }

    // Activates/updates the requested portal
    this.teleport.activate(`fab-${newSide}-${newEdge}`, this.template, {
      direction: this.direction,
      align: this.align,
      gap: this.gap
    } as FabOptions);
  }

  // Releases the portal when done
  ngOnDestroy() { this.teleport.clear(`fab-${this.side}-${this.edge}`, this.template); }
}
