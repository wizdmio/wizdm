<!-- toc: docs/reference.json -->

# Inkbar
[Go to the API Reference](#api-reference)

Wizdm **Inkbar** delivers a lightweight implementation to  the active tab's label,designated with the animated **inkbar** smoothly shifting across tabs to highlight the current selected one.


## Usage Note
`wm-inkbar`  is an Angular component that you can use with regular buttons, links  and all kind of elements in your application.

`wm-router-inkbar` provides the feel you give to the users of your application when navigating to selected active tab using animation and inkbar feature.

 **Note:** The `wm-inkbar` and `wm-router-inkbar` can be used separately and in different part of your application. The **wm-inkbar** apply to elements on the same page not requiring navigation while **wm-router-inkbar** is used when navigation between components is triggered. This features are standalone components not depending on the other to work.

&nbsp;

## Usage example

-  Run **`yarn add @wizdm/elements`** or **`npm install @wizdm/elements`**.
-  Import `NavInkbarModule` into a module which declares a component intended to have a `wm-router-inkbar` element.


```html
<wm-router-inkbar side="right">
    <a mat-button  [routerLink]="'/home'" routerLinkActive>
      Home
    </a>
    <a mat-button [routerLink]="'/about'" routerLinkActive>
      About
    </a>
    <a mat-button  [routerLink]="'/contact'" routerLinkActive>
      Contact
    </a>
    <a mat-button  [routerLink]="'/profile'" routerLinkActive>
      Profile
    </a>
  </wm-router-inkbar>

```
In the example above **wm-router-inkbar** serve as a container  which wraps the **Link** tag in the template, upon navigation to different links the **inkbar** appears on the currently active tab.


# API Reference
[InkbarModule](#inkbarmodule) - [InkbarComponent](#inkbarcomponent)  - [InkbarDirective](#inkbardirective) - [NavInkbarModule](#navinkbarmodule) - [RouterInkbarComponent](#routerinkbarcomponent) - [RouterInkbarDirectiv](#routerinkbardirective)


## InkbarModule
 Import **`InkbarModule`** into a module which declares a component intended to use `wm-inkbar` tag.

```typescript
import { InkbarModule } from '@wizdm/elements/inkbar';

```
&nbsp;

## InkbarComponent
```typescript 

@Component({
  selector: 'wm-inkbar',
})
export class InkbarComponent {

  public pos: inkbarPosition = { left: 0, top: 0, width: 0, height: 0 };

  /** True when the inkbar slides vertically */
  public vertical(): boolean {}

  public clear() {} 

  /** Inkbar color */
  @Input() color: ThemePalette = 'accent';

  /** inkbar thickness */
  @Input() thickness: number = 2;

  /** side to apply the inkbar to */
  @Input() side: 'left'|'top'|'right'|'bottom' = 'bottom';
  
}

```
&nbsp;

## InkbarDirective

```typescript

export interface InkbarItem {
  elm: ElementRef<HTMLElement>;
  isActive: boolean;
}

@Directive({
  selector: '[wmInkbarIf]',
})
export class InkbarDirective implements InkbarItem {

  public isActive: boolean;

  @Input() wmInkbarIf: boolean
}

```

&nbsp;

## NavInkbarModule
Import **`NavInkbarModule`** into a module which declares a component intended to use `wm-router-inkbar` tag.


```typescript
import { NavInkbarModule } from '@wizdm/elements/router-inkbar';

```

&nbsp; 

## RouterInkbarComponent

```typescript
@Component({
  selector: 'wm-router-inkbar',
})
export class RouterInkbarComponent extends InkbarComponent {


  // Returns the active InkbarItem, if any
  get activeLink(): InkbarItem {
    // Search for the active link or item
    return this.links?.find( link => link.isActive ) || this.items?.find( link => link.isActive );
  }

  // Overrides the update() reverting to the active link
  public update() {  
    this.activateLink( this.activeLink );
  }
}


```

&nbsp;

## RouterInbarDirective

```typescript

@Directive({
  selector: '[wmInkbarLink], [routerLinkInkbar]',
})
export class RouterInkbarDirective extends RouterLinkActive implements InkbarItem {


  // Passes along the optional class(es) to apply
  @Input() routerLinkInkbar: string[] | string;
}

``` 
&nbsp;

## Directives

| **Properties** | **Description**                                                                |
| :------------- | :----------------------------------------------------------------------------- |
| wmInkbarIf     | Uses the **InkbarDirective** to drag the inkbar whenever a menu link is active |


&nbsp;  

# Attributes

| **Properties**             | **Description**                                                                                                                                                     |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| @Input() color: string     | Set current color using the angular material **ThemePallete** value                                                                                                 |
| @Input() side: string      | When set it displays the inkbar at the specified position on the active tab element. Default to *bottom*. You can set value to be **left \| top \|right \| bottom** |
| @Input() thickness: number | Use attribute to set the inkbar width and height. The default is `2`                                                                                                |

 

&nbsp;  


### **Blog Post**

Link to a helpful post by the Wizdm author on medium:
[Animating UI Elements in Angular #1]('https://medium.com/wizdm-genesys/animating-ui-elements-in-angular-1-ae3fc3cadb1b')

 
->
[Continue Next](docs/toc?go=next) 
->
