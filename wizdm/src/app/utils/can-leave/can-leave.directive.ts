import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CanLeaveGuard } from './can-leave.service';
import { DialogComponent } from '@wizdm/elements/dialog';
import { Observable, of, defer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Directive({
  selector: 'wm-dialog[dontLeave]'
})
export class CanLeaveDirective {

  constructor(private canLeave: CanLeaveGuard, private dialog: DialogComponent<boolean>) {
    // Hooks on the allowDeactivation observer
    this.canLeave.allowDeactivation( this.canLeave$ );
  }

  /** When true, pops-up a dialog asking for user's consent to leave*/
  @Input() dontLeave: boolean = false;

  /** Reflects the dontLeave changes */
  @Output() dontLeaveChange = new EventEmitter<boolean>();

   // CanLeave Observavble
  private get canLeave$(): Observable<boolean> {
    // Builds an observable conditionally at subscription time
    return defer( () => this.dontLeave ? this.dialog.open().afterClosed() : of(true) )
      // Makes sure all the following requests will be true once the first has been granted
      .pipe( tap( granted => (granted === this.dontLeave) && this.dontLeaveChange.emit(this.dontLeave = !granted) ));
  }

  // Prevents the tab/page to be closed 
  @HostListener('window:beforeunload', ['$event']) beforeUnload(ev: Event) {

    if(this.dontLeave) {
      return false;
    }
  }
}