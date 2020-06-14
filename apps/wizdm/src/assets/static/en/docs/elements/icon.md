<!-- toc: docs/reference.json -->

# Icon

[Go to the API Reference](#api-reference)

Both Material icons and Font Awesome icon set are natively supported to enrich your user interface. This directive supports both icon fonts and SVG icons, but not bitmap-based formats(png, jpg, etc). `wm-icon` component also makes available usage of [Material Icon Extended](https://petershaggynoble.github.io/MDI-Sandbox/extended/).


## Usage Example

1. Run **`yarn add @wizdm/elements`** or `npm install @wizdm/elements`.
2. Import `IconModule` into a module which declares a component intended to have a Wizdm Icon.
3. Import `BrowserAnimationsModule` into `AppModule`  unless it is imported.
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatIconModule,
  MatButtonModule
} from '@angular/material';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [   
    BrowserModule, 
    BrowserAnimationsModule,

  ],
  ...
})
export class AppModule { }


```
4. Add the link tag for **Font Awesome**  or [**Material Icon**](https://google.github.io/material-design-icons/#icon-font-for-the-web) path in your index.html file.
5. Using **Font Awesome** Icon would require you import [MatIconRegistry](https://material.angular.io/components/icon/overview#registering-icons) and register it in your component.

```typescript
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'icon-overview-example',
  templateUrl: './icon-overview-example.html',
})**
export class IconOverviewExample implements OnInit { 

  private icons = [
    // Material Icon 
      'account_circle',
      'email',
      'language',

    // Font Awesome Icon
      'far:fa-user',
      'far:fa-envelope',
      'fas:fa-language',
      'fas:fa-phone'

      // Material Icon Extended
      'all_inbox',
      'add_to_drive',
  ];

  constructor(private icon: MatIconRegistry) {}

  ngOnInit() {

    // Registers font awesome among the available sets of icons for mat-icon component
    this.icon.registerFontClassAlias('fontawesome', 'fa');
  }
}


``` 

6. Add html-markup to the template of the component (in this case, add it to `icon-overview-example.html`):
The **wm-icon directive** can be used within your template file using this syntax:

```html

    <button *ngFor="let icon of icons">
      <wm-icon [icon]="icon"></wm-icon>
    </button>

  ...
  
```

**Note**:  The icon attribute should be omitted when Material icon is in use in this manner.

```html

      <wm-icon>menu</wm-icon>

  ...
  
```

## Theming
By default, icons will use the current font color (`currentColor`). This color can be changed to
match the current theme's colors using the `color` attribute. This can be changed to
`'primary'`, `'accent'`, or `'warn'`.


```html
 
  <wm-icon [color]="myIconColor"
           [icon]="fas:fa-message"></wm-icon>
  ...
  
```
The above illustration bind's the myIconColor property of the component class to color attribute in the template.
Also, inline attribute is set to `false` by default in wizdm icon class. You can set this attribute to true to enable inline functionality.

&nbsp;


# API Reference
[IconModule](#iconmodule) - [IconComponent](#Iconcomponent) 


&nbsp;  

## IconModule 

```typescript
import { IconModule } from '@wizdm/elements/icon';
```

## IconComponent

```typescript
@Component({
  selector: 'wm-icon'
})
export class IconComponent {

  public extended: boolean;
  public inline: boolean;
  public fontSet: string;
  public fontIcon: string;
  public matIcon = "code";

  @Input() color: ThemePallete
  @Input('inline') inlining: boolean
  @Input('icon') setIcon: string

}
```

| **Properties**                 | **Description**                                                                                                   |
| :----------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `@Input() icon: string;`       | Attribute takes an icon set and name to be rendered in the template. Support both font awesome and material icons |
| `@Input() color: ThemePalette` | icon(s) can be colored in terms of the current theme value                                                        |

&nbsp;

---  
->
[Continue Next](docs/toc?go=next) 
->
