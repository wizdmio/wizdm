import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { LazyDialogLoader } from './lazy-dialog.service';

@Directive({
  selector: '[openDialog]'
})
export class LazyDialogDirective<T, R> {

  constructor(private loader: LazyDialogLoader) { }

  /** Name of the dialog to open */
  @Input('openDialog') dialog: string;

  /** Optional dialog data to pass along */
  @Input('dialogData') data: T;

  /** Emits the dialog closing value */
  @Output('dialogClosed') closed = new EventEmitter<R>();

  /** Emits the dialog closing value whenever truthy */
  @Output('dialogClosedTruthy') closedTruthy = new EventEmitter<R>();

  /** Emits the dialog closing value whenever truthy */
  @Output('dialogClosedFalsy') closedFalsy = new EventEmitter<R>();

  /** Opens the dialog on click */
  @HostListener('click') onClick() {

    !!this.dialog && this.loader.open<T,R>(this.dialog, this.data)
      .then( value => {
        
        // Always emits the returned value on close
        this.closed.emit(value);
        // Emtits the dialog close value conditinally whenever truthy...
        if(coerceBooleanProperty(value)) { this.closedTruthy.emit(value); }
        //.. or falsy
        else { this.closedFalsy.emit(value); }
      });
  }
}
