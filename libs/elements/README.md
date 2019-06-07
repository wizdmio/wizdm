@wizdm/elements
===============

Elements are shareable UI components based on [Angular Material](https://material.angular.io). Working as an extension of Angular Material they require the very same kind of theming:

``` scss
@import '~@angular/material/theming';
@import '~@wizdm/elements/theming';

// Include the common styles for Angular Material once.
@include mat-core();

// Define the palettes for your theme.
$app-primary: mat-palette($mat-indigo);
$app-accent: mat-palette($mat-pink, A200, A100, A400);
// The warn palette is optional (defaults to red).
$app-warn: mat-palette($mat-red);

// Create the theme object (a Sass map containing all of the palettes).
$app-theme: mat-light-theme($app-primary, $app-accent, $app-warn);

// Include theme styles for material components.
@include angular-material-theme($app-theme);

// Include theme styles for wizdm elements too.
@include wm-elements-theme($app-theme) {
```

## Avatar

Avatar is a round shaped image automatically fitting the size of its container. Whenver the image isn't specified or can't be loaded simple avatar shape is displayed instead. The color of the avatar can be selected among "primary", "accent" and "warn" similarly to the way angular material components do.

``` html
<button mat-icon-button (click)="doSomething()">
  <wm-avatar color="primary" [src]="myImage"></wm-avatar>
</button>
```
