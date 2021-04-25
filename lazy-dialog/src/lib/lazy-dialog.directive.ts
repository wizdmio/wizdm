import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
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

  /** Opens the dialog on click */
  @HostListener('click') onClick() {

    !!this.dialog && this.loader.open<T,R>(this.dialog, this.data)
      .then( value => this.closed.emit(value) );
  }
}
