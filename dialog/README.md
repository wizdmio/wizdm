# Dialog 
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
By itself the component does not render anything until its `open()` method is called.
