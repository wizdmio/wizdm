import { Directive, TemplateRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { TeleportService } from '@wizdm/teleport';

export interface ToolbarOptions {
  align?: string;
  gap?: string;
}

@Directive({
  selector: 'ng-template[wmToolbar]'
})
export class ToolbarDirective implements OnInit, OnChanges, OnDestroy {

  constructor(private teleport: TeleportService, private template: TemplateRef<any>) { }

  /** The flex alignement */
  @Input() wmToolbarAlign: string;

  /** The flex gap */
  @Input() wmToolbarGap: string;

  // Activates the toolbar portal
  ngOnInit() { 
    
    this.teleport.activate('toolbar', this.template, {
      align: this.wmToolbarAlign,
      gap: this.wmToolbarGap
    } as ToolbarOptions);
  }

  // Refreshes on input change
  ngOnChanges(changes: SimpleChanges) { this.ngOnInit(); }

  // Releases the portal when done
  ngOnDestroy() { this.teleport.clear('toolbar', this.template); }
}
