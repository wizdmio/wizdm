import { Directive, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { skip, take, tap, map, filter, pluck } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NavigatorComponent } from '../navigator.component';
import { TeleportService } from '@wizdm/teleport';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

export interface SidenavConfig {
  mode?    : 'over'|'side';
  width?   : string;
  minWidth?: string;
  maxWidth?: string;
}

/** Teleports the given content towards the 'sidenav' portal witihn the navigator */
@Directive({
  selector: 'ng-template[wmSidenav]',
  exportAs: 'wmSidenav'
})
export class SidenavDirective implements OnInit, OnDestroy {

  private sub: Subscription;
  private _opened: boolean;

  /** Sidenav panel mode */
  @Input() mode: 'over'|'side';

  /** Sidenav panel width */
  @Input() width: string;

  /** Sidenav panel min width */
  @Input() minWidth: string;

  /** Sidenav panel max width */
  @Input() maxWidth: string;

  /** When true persists the open/close status within the route configuration to restore it accordingly */
  @Input('persist') set persistValue(persist: boolean) { this.persist = coerceBooleanProperty(persist); } 
  private persist: boolean = false;

  /** True when the sidenav panel is open */
  get opened() { return !!this._opened; }

  /** opens/closes the sidenav panel */
  @Input() set opened(open: boolean) {
    // Delegates the navigator to open/close the panel
    this.nav.openSidenav( this._opened = coerceBooleanProperty(open) );
  }

  /** Emits the open/close sidenav panel status */
  @Output() openedChange = new EventEmitter<boolean>(true);

  // The active route configuration data
  private get routeData(): any {
    // Returns the router config data, if any, or assigns an empty one
    return this.route.routeConfig.data || (this.route.routeConfig.data = {});
  }

  /** Opens the sidenav panel */
  public open() { this.opened = true; }

  /** Closes the sidenav panel */
  public close() { this.opened = false; }

  /** Toggles the sidenav panel */
  public toggle() { this.opened = !this.opened; }

  constructor(private nav: NavigatorComponent,
              private route: ActivatedRoute,
              private teleport: TeleportService, 
              private template: TemplateRef<HTMLElement>) { }

  ngOnInit() {

    // Intercepts the opened status subscribing to the relevant observable
    this.sub = this.nav.sideOpened$.pipe( 
      
      // Skipping the first emission so for the local status to prevail without getting overriden
      skip(1), 
      
      // Saves the last status change within the route data whenever persist is set to true
      tap( value => this.persist && (this.routeData['sidenav'] = value) ) 

      // Emits the output status
    ).subscribe( opened => this.openedChange.emit(this._opened = opened) );

    // Restores the previous status saved within the route configuration
    this.route.data.pipe( 

        // Loads the data once
        take(1), 

        // Pluks the 'sidenav' property
        pluck('sidenav'), 
        
        // Forces to start closed on small screens
        map( value => this.nav.mobile ? false : value ),
        
        // Filters unwanted values
        filter( value => this.persist && value !== undefined )

      // Applies the restored value
    ).subscribe( opened => this.openedChange.emit(this._opened = opened) );

    // Activates the content towards the 'sidenav' portal
    this.teleport.activate('sidenav', this.template, {
      mode: this.mode,
      width: this.width,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth
    } as SidenavConfig);
  }

  ngOnChanges(changes: SimpleChanges) {

    // Asserts some width related inut changed...
    if(changes.mode || changes.width || changes.minWidth || changes.maxWidth) {
      // ...applies the changes
      this.teleport.activate('sidenav', this.template, {
        mode: this.mode,
        width: this.width,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth
      } as SidenavConfig);
    }
  }

  ngOnDestroy() {
    // Unsubscribes from the observable
    this.sub.unsubscribe();
    // Clears the content
    this.teleport.clear('sidenav', this.template);
  }
}
