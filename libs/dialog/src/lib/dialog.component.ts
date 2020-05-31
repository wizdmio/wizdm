import { MatDialog, MatDialogRef, MatDialogConfig, DialogRole, DialogPosition } from '@angular/material/dialog';
import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef, forwardRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { Direction } from '@angular/cdk/bidi';

/** Dialog ref */
export type DialogRef<D=any, R=any> = MatDialogRef<D, R>;

/** Fake MatDialogRef provider to support MatDialogClose directive */
export const FAKE_REF_FOR_CLOSE: any = { 
  provide: MatDialogRef, 
  useExisting: forwardRef( () => DialogComponent ) 
};

/** 
 * Component implementing a declarative version of the Angular Material Dialog 
 */
@Component({
  selector: 'wm-dialog',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  providers: [ FAKE_REF_FOR_CLOSE ]
})
export class DialogComponent<D=any, R=any> implements MatDialogConfig<D> {

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  /** The dialog reference, when openend */
  public ref: DialogRef<D,R>;
  /** Data available for injection into the child component. */
  public data: D;

  constructor(readonly dialog: MatDialog/*, readonly viewContainerRef: ViewContainerRef*/) {}

  // -- Start of MatDialogConfig implementaiton -- 
  
  /** ID for the dialog. If omitted, a unique one will be generated. */
  @Input() id: string;

  /** The ARIA role of the dialog element. */
  @Input() role: DialogRole = 'dialog';
  
  /** Custom class for the overlay pane. */
  @Input() panelClass: string | string[] = ''
  
  /** Whether the dialog has a backdrop. */
  @Input('hasBackdrop') set _hasBackdrop(value: boolean) { this.hasBackdrop = coerceBooleanProperty(value); }
  hasBackdrop: boolean = true;
  
  /** Custom class for the backdrop. */
  @Input() backdropClass: string = '';
  
  /** Whether the user can use escape or clicking on the backdrop to close the modal. */
  @Input('disableClose') set _disableClose(value: boolean) { this.disableClose = coerceBooleanProperty(value); }
  disableClose: boolean = false;
  
  /** Width of the dialog. */
  @Input() width: string = '';
  
  /** Height of the dialog. */
  @Input() height: string = '';
  
  /** Min-width of the dialog. If a number is provided, assumes pixel units. */
  @Input() minWidth: number | string;
  
  /** Min-height of the dialog. If a number is provided, assumes pixel units. */
  @Input() minHeight: number | string;
  
  /** Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw. */
  @Input() maxWidth: number | string = '80vw';
  
  /** Max-height of the dialog. If a number is provided, assumes pixel units. */
  @Input() maxHeight: number | string;
  
  /** Position overrides. */
  @Input() position: DialogPosition;
  
  /** Layout direction for the dialog's content. */
  @Input() direction: Direction;
  
  /** ID of the element that describes the dialog. */
  @Input() ariaDescribedBy: string | null = null;
  
  /** ID of the element that labels the dialog. */
  @Input() ariaLabelledBy: string | null = null;
  
  /** Aria label to assign to the dialog element. */
  @Input() ariaLabel: string | null = null;
  
  /** Whether the dialog should focus the first focusable element on open. */
  @Input('autoFocus') set _autoFocus(value: boolean) { this.autoFocus = coerceBooleanProperty(value); }
  autoFocus: boolean = true;
  
  /** Whether the dialog should restore focus to the previously-focused element, after it's closed. */
  @Input('restoreFocus') set _restoreFocus(value: boolean) { this.restoreFocus = coerceBooleanProperty(value); }
  restoreFocus: boolean = false;
  
  /** Scroll strategy to be used for the dialog. */
  @Input() scrollStrategy: ScrollStrategy;
  
  /** Whether the dialog should close when the user goes backwards/forwards in history. */
  @Input('closeOnNavigation') set _closeOnNavigation(value: boolean) { this.closeOnNavigation = coerceBooleanProperty(value); }
  closeOnNavigation: boolean = true;

  // -- End of MatDialogConfig implementaiton -- 

  /** Opens the dialog when the passed condition is true */
  @Input() set opened(open: D) { if(coerceBooleanProperty(open)) { this.open(open); } }  
  /** Reports the open status */
  @Output() openedChange = new EventEmitter<boolean>();
  /** Forces the dialog closing with the given value */
  @Input() set closed(value: R) { this.close(value); }  
  /** Reports the value the dialog as been closed with */
  @Output() closedChange = new EventEmitter<R>(); 
  
  /** Opens the dialog returning the reference */
  public open(data?: D): DialogRef<D,R> {
    // Prevents multiple opening
    if(!!this.ref) { return this.ref; }
    // Grabs the optional data
    this.data = data;
    // Opens the dialog with the given configuration
    this.ref = this.dialog.open<any,D,R>(this.template, this);
    // Emits the dialog has been opened
    this.ref.afterOpened().subscribe( () => this.openedChange.emit(true) );
    // Emist the dialog is closing
    this.ref.beforeClosed().subscribe( () => this.openedChange.emit(false) );
    
    this.ref.afterClosed().subscribe( value => {
      // Emits the dialog closed with value
      this.closedChange.emit(value);
      // Makes sure the reference goes backundefined when closed 
      this.ref = undefined;
    });
    // Returns the reference for further use
    return this.ref;
  }

  /** Closes the dialog passing along the output value */
  public close(value: R): void {
    this.ref && this.ref.close(value);
  }
}
