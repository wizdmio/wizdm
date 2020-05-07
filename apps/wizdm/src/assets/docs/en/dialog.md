<!-- toc: toc.json -->

# Dialog 
[Go to the API Reference](docs/dialog#api-reference)

Dialog is a package providing a declarative dialog component by extending the [Angular Material Dialog](https://material.angular.io/components/dialog/api). 

## Usage example
`<wm-dialog>` is a component designed to display a popup dialog on request. The example below illustrates how the `<wm-dialog>` is used to design the dialog content by using the very same `MatDialog` directives: 

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
By itself the component does not render anything until its `open()` method is called. 

&nbsp;  

# API Reference 
```typescript
import { DialogModule } from '@wizdm/dialog';
```
## DialogComponent
The `wmAnimate` component enables the animation of the target element.

```typescript
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
  @Input() minHeight?: number | string;
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
|`animating: boolean`|**True** when the animation is running|
|`animated: boolean`|**True** after the animation completed. False while the animation is running|
|`@Input('wmAnimate') animate: wmAnimations`|Selects the animation to play. See [supported animations](docs/aos#supported-animations)| 
|`@Input() set speed(speed: wmAnimateSpeed)`|Speeds up or slows down the animation. See [timing](docs/aos/#timing)|
|`@Input() set delay(delay: string)`|Delays the animation execution. See [timing](docs/aos/#timing)|
|`@Input() disabled: boolean`|Disables the animation|
|`@Input() paused: boolean`|When **true**, keeps the animation idle until the next replay triggers|
|`@Input() set aos(threshold: number)`|When defined, triggers the animation on element scrolling in the viewport by the specified amount. Amount defaults to 50% when not specified. See [Animate On Scroll](docs/aos#animate-on-scroll)|
|`@Input() once: boolean`|When **true**, prevents the animation to run again|
|`@Input() set replay(replay: any)`|Replays the animation|
|`@Output() start: EventEmitter<void>`|Emits at the beginning of the animation|
|`@Output() done: EventEmitter<void>`|Emits at the end of the animation|  

### Methods

---

```typescript
public setup(options: AnimateOptions)
```
Configures the service with the given **options**:

```typescript
export interface AnimateOptions {
  
  root?: Element;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}
```

* `root`: An optional element which bounding rectanlge will be used as the animation view. When undefined or null, the overall viewport will be used.
* `left`: An offset, expressed in **pixels**, to shrink the triggering area from the left with. This value overrides the global `offsetLeft` value.
* `top`: An offset, expressed in **pixels**, to shrink the triggering area from the top with. This value overrides the global `offsetTop` value.
* `right`: An offset, expressed in **pixels**, to shrink the triggering area from the right with. This value overrides the global `offsetRight` value.
* `bottom`: An offset, expressed in **pixels**, to shrink the triggering area from the bottom with. This value overrides the global `offsetBottom` value.

---

```typescript
public trigger(elm: ElementRef<HTMLElement>, threshold: number): OperatorFunction<boolean, boolean>
```
Observable operator to be used for triggering the animation on scroll. 
* `elm`: The element for which the animation will be triggered.
* `threshold`: The visibility ratio to trigger the animation with. 

The returned `OperatorFunction` accepts an input trigger to emit an output trigger. In case the threshold value is 0, the output trigger simply mirrors the input one. For values greater than 0, the service checks the given element's area against the animation view emitting **true** when the two rectangles intersect for an area equal or greater than the threshold value, emitting **false** when the element's area is totally out of the view area. 

---
->
[Next Topic](docs/toc?go=next) 
->
