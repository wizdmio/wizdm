@wizdm/elements
===============

Elements are shareable UI components based on [Angular Material](https://material.angular.io). 

* [Theming](#theming)
* [Avatar](#avatar)
* [Icon](#icon)
* [Toggler](#toggler)

## Avatar

Avatar is a round shaped image automatically fitting the size of its container. Whenver the image isn't specified or can't be loaded simple avatar shape is displayed instead. The color of the avatar can be selected among "primary", "accent" and "warn" similarly to the way angular material components do.

``` html
<button mat-icon-button (click)="doSomething()">
  <wm-avatar color="primary" [src]="myImage"></wm-avatar>
</button>
```

## Icon

The icon element extends the `mat-icon` component so you can freely mix up [material icons](https://material.io/tools/icons) and other registered collections such as [FontAwesome](https://fontawesome.com/icons):

``` typescript
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'body',
  template: '<a mat-mini-fab *ngFor="let icon of icons"><wm-icon [icon]="icon"></wm-icon></a>',
  styles: [],
  host: { 'class': 'mat-typography' }
})
export class AppComponent implements OnInit { 

  private icons = [
      'account_circle',
      'far:fa-user',
      'email',
      'far:fa-envelope',
      'language',
      'fas:fa-language',
      'fas:fa-phone'
  ];

  constructor(private icon: MatIconRegistry) {}

  ngOnInit() {

    // Registers font awesome among the available sets of icons for mat-icon component
    this.icon.registerFontClassAlias('fontawesome', 'fa');
  }
}
```

## Toggler

The toggler implements an icon-like element, to be used in conjunction with mat-button and other material components, displaying the typical menu toggler and animating to/from the 'x' shaped symbol representing the close/cancel function. 

``` html
<button mat-icon-button (click)="opened = !opened">
  <wm-toggler toggler-style="menu" [status]="opened"></wm-toggler>
</button>
```

The icon style can be selected among:
* `menu` to display the three horizontal lines (hamburger)
* `more_vert` to display the three vertical dots
* `more_horiz` to display the three horizontal dots

## Theming

Working as an extension of Angular Material the library requires the very same kind of theming:

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

As a side effect, by using the `extend-material-theme` mixin you can actually overwrite some of the angular material standard foreground/background values for your convenience.
