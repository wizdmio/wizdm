import { Directive, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ActivatedRoute } from '@angular/router';
import { NavigatorComponent } from '../navigator.component';
import { TeleportService } from '@wizdm/teleport';
import { skip, take, tap, map, filter, pluck } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/** Teleports the given content towards the 'sidenav' portal witihn the navigator */
@Directive({
  selector: 'ng-template[wmSidenav]',
  exportAs: 'wmSidenav'
})
export class SidenavDirective implements OnInit, OnDestroy {

  private sub: Subscription;
  private _opened: boolean;

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
  @Output() openedChange = new EventEmitter<boolean>();

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
    ).subscribe( data => this.opened = data );

    // Activates the content towards the 'sidenav' portal
    this.teleport.activate('sidenav', this.template);
  }

  ngOnDestroy() {

    // Unsubscribes from the observable
    this.sub.unsubscribe();
    
    // Clears the content
    this.teleport.clear('sidenav');
  }
}
