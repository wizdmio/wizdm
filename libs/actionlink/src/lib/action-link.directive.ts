import { Directive, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActionLinkObserver } from './action-link.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[wmActionLink]'
})
export class ActionLinkDirective implements OnDestroy {

  private sub: Subscription;

  constructor(private observer: ActionLinkObserver) { }

  /** Sets the link path the directive will activate upon */
  @Input() set wmActionLink(link: string) {

    // Unsubscribes previous subscriptions, if any
    this.sub && this.sub.unsubscribe();

    // Registers to the specified link to emit on activation
    this.sub = this.observer.register(link).subscribe( params => 
      this.activate.emit( params ) 
    );
  }

  /** Emits on activation */
  @Output() activate = new EventEmitter<{ [key: string]: string } | undefined>();

  /** Disposes of the subscriptions */
  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
