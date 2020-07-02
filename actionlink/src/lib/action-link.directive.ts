import { Directive, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActionLinkObserver, ActionData } from './action-link.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[wmActionLink]'
})
export class ActionLinkDirective implements OnDestroy {

  private sub: Subscription;

  constructor(private observer: ActionLinkObserver) { }

  /** Sets the link path the directive will activate upon */
  @Input() set wmActionLink(action: string) {

    // Unsubscribes previous subscriptions, if any
    this.sub && this.sub.unsubscribe();

    // Registers to the specified link to emit on activation
    this.sub = this.observer.register(action).subscribe( data => { 

      // Always emit the activation event
      this.activate.emit( data );
    });
  }

  /** Emits on activation */
  @Output() activate = new EventEmitter<ActionData>();

  /** Disposes of the subscriptions */
  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
