import { Directive, OnDestroy, OnChanges, SimpleChanges, SimpleChange, Input, Output, EventEmitter, TemplateRef, ViewContainerRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { switchMap, delay } from 'rxjs/operators';
import { Subscription, BehaviorSubject } from 'rxjs';
import { TeleportService, TeleportPayload } from './teleport.service';

@Directive({
  selector: 'ng-template[wmPortal]',
  exportAs: 'wmPortal'
})
export class PortalDirective extends NgTemplateOutlet implements OnDestroy, OnChanges {

  private name$ = new BehaviorSubject<string>('');
  private firstChange: boolean = true;
  private sub: Subscription;

  /** The portal name */
  @Input('wmPortal') set name(name: string) { this.name$.next(name); }

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

    // Builds the template observable
    this.sub = this.name$.pipe( 

      // Beams the content with the given name
      switchMap( name => this.teleport.beam(name) ),

      // Wait the next round to avid expressionChangedAfterItHasBeenChecked() exception
      delay(0)
 
    ).subscribe( payload => this.changeTemplate(payload || {} as TeleportPayload) );
  }

  private changeTemplate({ template, data }: TeleportPayload) {

    // Emits the new optional data, if any
    if(typeof(data) !== undefined) { this.data.emit(data); }

    /** Skips on no template changes */
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