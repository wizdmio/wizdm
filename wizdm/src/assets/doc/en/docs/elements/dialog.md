<!-- toc: docs/reference.json -->

# Dialog 
[Go to the API Reference](#api-reference)

Dialog is a package providing a declarative version of the [Angular Material Dialog](https://material.angular.io/components/dialog/api). 

## Usage example
`<wm-dialog>` is a component designed to display a popup dialog on request. The example below illustrates how the component is used to design the dialog content by using the very same [MatDialog directives](https://material.angular.io/components/dialog/api#directives): 

```html
<!-- Opens the dialog on click -->
<button mat-button (click)="popup.open()">Open Popup</button>

<!-- Hidden dialog -->
<wm-dialog disableClose (closedChange)="onDialogClosed($event)" #popup>

  <h2 mat-dialog-title><b>Pop up dialog</b></h2>

  <mat-dialog-content class="text-justify">
    This popup dialog template is part of the AppComponent.
    There's no need of creating a component or a template on purpose
    for a dialog to work anymore.
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button color="warn" [mat-dialog-close]="false">Ok</button>
    <button mat-button color="primary" [mat-dialog-close]="true">Ok</button>
  </mat-dialog-actions>

</wm-dialog>
```
By itself the component does not render anything until its `open()` method is called, in this case by a button click event. 

&nbsp;  

# API Reference 
```typescript
import { DialogModule } from '@wizdm/elements/dialog';
```
## DialogComponent
The `<wm-dialog>` component defines a pop-up dialog.

```typescript
export type DialogRef<D=any, R=any> = MatDialogRef<D, R>;

@Component({
  selector: 'wm-dialog',
  template: '<ng-template><ng-content></ng-content></ng-template>'
})
export class DialogComponent<D=any, R=any> implements MatDialogConfig<D> {

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  public ref: DialogRef<D,R>;
  public data: D;

  constructor(readonly dialog: MatDialog) {}

  @Input() id: string;
  @Input() role: DialogRole = 'dialog';
  @Input() panelClass: string | string[] = ''
  @Input() hasBackdrop: boolean = true;
  @Input() backdropClass: string = '';
  @Input() disableClose: boolean = false;
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() minWidth: number | string;
  @Input() minHeight: number | string;
  @Input() maxWidth: number | string = '80vw';
  @Input() maxHeight: number | string;
  @Input() position: DialogPosition;
  @Input() direction: Direction;
  @Input() ariaDescribedBy: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() autoFocus: boolean = true;
  @Input() restoreFocus: boolean = false;
  @Input() scrollStrategy: ScrollStrategy;
  @Input() closeOnNavigation: boolean = true;

  @Input() set opened(open: boolean);  
  @Output() openedChange: EventEmitter<boolean>;

  @Input() set closed(value: R);  
  @Output() closedChange: EventEmitter<R>; 
  
  public open(data?: D): DialogRef<D, R>;
  public close(value: R): void;
}
```

|**Properties**|**Description**|
|:--|:--|
|`template: TemplateRef<any>`|The reference to the template used to render the dialog|
|`ref: DialogRef<D,R>`|The dialog reference once the dialog has been rendered|
|`data: D`|The optional generic data passed along when opening the dialog|
|`@Input() id: string`|ID for the dialog. If omitted, a unique one will be generated|
|`@Input() role: DialogRole`|The ARIA role of the dialog element|
|`@Input() panelClass: string`\|`string[]`|Custom class for the overlay pane|
|`@Input() hasBackdrop: boolean`|Whether the dialog has a backdrop|
|`@Input() backdropClass: string`|Custom class for the backdrop|
|`@Input() disableClose: boolean`|Whether the user can use escape or clicking on the backdrop to close the modal|  
|`@Input() width: string`|Width of the dialog|  
|`@Input() height: string`|Height of the dialog|
|`@Input() minWidth: number`\|`string`|Min-width of the dialog. If a number is provided, assumes pixel units|
|`@Input() minHeight: number`\|`string`|Min-height of the dialog. If a number is provided, assumes pixel units|
|`@Input() maxWidth: number`\|`string`|Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw|
|`@Input() maxHeight: number`\|`string`|Max-height of the dialog. If a number is provided, assumes pixel units|
|`@Input() position: DialogPosition`|Position overrides|
|`@Input() direction: Direction`|Layout direction for the dialog's content|
|`@Input() ariaDescribedBy: string`|ID of the element that describes the dialog|
|`@Input() ariaLabelledBy: string`|ID of the element that labels the dialog|
|`@Input() ariaLabel: string`|Aria label to assign to the dialog element|
|`@Input() autoFocus: boolean`|Whether the dialog should focus the first focusable element on open|
|`@Input() restoreFocus: boolean`|Whether the dialog should restore focus to the previously-focused element, after it's closed|
|`@Input() scrollStrategy: ScrollStrategy`|Scroll strategy to be used for the dialog|
|`@Input() closeOnNavigation: boolean`|Whether the dialog should close when the user goes backwards/forwards in history|
|`@Input() set opened(open: boolean)`|Opens the dialog when the passed condition is true|
|`@Output() openedChange: EventEmitter<boolean>`|Reports the open status|
|`@Input() set closed(value: R)`|Forces the dialog closing with the given value|
|`@Output() closedChange: EventEmitter<R>`|Reports the value the dialog as been closed with| 


### Methods 

---

```typescript
public open(data?: D): DialogRef<D,R>;
```
Opens the dialog returning its reference.
* `data: D` - Optional generic data for the dialog to be consumed.

Returns a 'DialogRef<D,R>' corresponding to the underlying [MatDialogRef](https://material.angular.io/components/dialog/api#MatDialogRef) object. 

---

```typescript
public close(value: R): void;
```
Closes the dialog passing along the output value.
* `value: R` - The generic value returned by the dialog reference after closin the dialogg. This same value is emitted by the `closedChange` event.

---
->
[Continue Next](docs/toc?go=next) 
->
