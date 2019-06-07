@wizdm/elements
===============

Elements are shareable UI components based on [Angular Material](https://material.angular.io). 

* [Theming](#theming)


## Avatar

Avatar is a round shaped image automatically fitting the size of its container. Whenver the image isn't specified or can't be loaded simple avatar shape is displayed instead. The color of the avatar can be selected among "primary", "accent" and "warn" similarly to the way angular material components do.

``` html
<button mat-icon-button (click)="doSomething()">
  <wm-avatar color="primary" [src]="myImage"></wm-avatar>
</button>
```


## Icon

## Toggler

## Theming

Working as an extension of Angular Material they require the very same kind of theming:

``` scss
@import '~@angular/material/theming';
@import '~@wizdm/elements/theming';

// Include the common styles for Angular Material once.
@include mat-core();

// Defines the main theme colors palettes.
$wm-primary: mat-palette($mat-blue);
$wm-accent:  mat-palette($mat-indigo, A200, A100, A400);
$wm-warn:    mat-palette($mat-red);

// Creates a standard material light theme first...
$wm-theme: mat-light-theme($wm-primary, $wm-accent, $wm-warn);
//... than extends the theme with customized values
$wm-theme: extend-material-theme($wm-theme, 
  $foreground: (
    // Overwrites some Angular Material standard values
    base:              mat-color($wm-primary, 900),
    disabled-button:   rgba(mat-color($wm-primary, 900), 0.26),
    icon:              mat-color($wm-primary),
    icons:             mat-color($wm-primary),
    text:              rgba(mat-color($wm-primary, 900), 0.87),
    slider-min:        rgba(mat-color($wm-primary, 900), 0.87),
    slider-off:        rgba(mat-color($wm-primary, 900), 0.26),
    slider-off-active: rgba(mat-color($wm-primary, 900), 0.38),
    
    // Adds Elements specific foreground extensions
    toggler:           mat-color($mat-grey, 500),
    action:            mat-color($wm-primary),
    link:              mat-color($wm-primary)
  ),
  $background: (
    // Overwrites some Angular Material standard values
    status-bar:       white,
    app-bar:          white,
    background:       white
  )
);

// Include theme styles for material components.
@include angular-material-theme($wm-theme);

// Include theme styles for wizdm elements too.
@include wm-elements-theme($wm-theme) {
```

