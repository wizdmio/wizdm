import { Directive, OnInit, OnDestroy, OnChanges, SimpleChanges, SimpleChange, Input, Output, EventEmitter, TemplateRef, ViewContainerRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { observeOn } from 'rxjs/operators';
import { Subscription, animationFrameScheduler } from 'rxjs';
import { TeleportService, TeleportPayload } from './teleport.service';

@Directive({
  selector: 'ng-template[wmPortal]',
  exportAs: 'wmPortal'
})
export class PortalDirective extends NgTemplateOutlet implements OnInit, OnDestroy, OnChanges {

  private firstChange: boolean = true;
  private sub: Subscription;

  /** The portal name */
  @Input('wmPortal') name: string;

  /** The portal context */
  @Input('wmPortalContext') ngTemplateOutletContext: Object|null;

  /** The actual template in use. NOTE for this event to bind correclty yhe directive must be used in its de-sugared form */
  @Output('wmPortalTemplate') template = new EventEmitter<TemplateRef<Object|null>>();

  /** True then the portal is active  */
  @Output('wmPortalActive') active = new EventEmitter<boolean>();

  /** Optional data passed along from the TeleportDirective back to the Portal */
  @Output('wmPortalData') data = new EventEmitter<any>();

  constructor(private teleport: TeleportService, private host: TemplateRef<Object|null>, container: ViewContainerRef) { 
    super(container); 
  }

  ngOnInit() {

    // Builds the template observable
    this.sub = this.teleport.beam(this.name).pipe(

      // Schedule on the next animation frame
      observeOn( animationFrameScheduler )
 
    ).subscribe( template => this.changeTemplate(template || { template: null }) );
  }

  private changeTemplate({ template, data }: TeleportPayload) {

    /** Skips on no changes */
    if(template === this.ngTemplateOutlet) { return; }

    // Creates a simple change object
    const ngTemplateOutlet = new SimpleChange(this.ngTemplateOutlet, template || this.host, this.firstChange);

    // Updates the parent's template variable accordingly
    this.ngTemplateOutlet = ngTemplateOutlet.currentValue;
    
    // Tracks for the first change
    this.firstChange = false;
    
    // Forces the change to occur
    super.ngOnChanges({ ngTemplateOutlet });

    // Emits the new template
    this.template.emit(this.ngTemplateOutlet);

    // Emits the optional data, if any
    this.data.emit(data || null);

    // Emits true whenever the template isn't the host one
    this.active.emit(this.ngTemplateOutlet !== this.host);
  }

  // Intercepts the input changes
  ngOnChanges(changes: SimpleChanges) {
    
    // Gets rid of the name's SimpleChange object
    if(changes.name) { delete changes.name; }
    
    // Skips when no changes remains
    if(Object.keys(changes).length === 0) { return; }
    
    // Lets the context changes go through
    super.ngOnChanges(changes);
  }

  // Disposes of the subscription on deletion
  ngOnDestroy() { this.sub.unsubscribe(); }
}