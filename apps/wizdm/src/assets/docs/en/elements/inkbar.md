<!-- toc: reference.json -->

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
-  Import `NavInkbarModule` into a module which declares a component intended to have a Wizdm Icon.


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
[InkbarModule](#inkbarmodule) - [NavInkbarModule](#navinkbarmodule)


### InkbarModule
 Import **`InkbarModule`** into a module which declares a component intended to use `wm-inkbar` tag.

```typescript
import { InkbarModule } from '@wizdm/elements/inkbar';

```
---

### NavInkbarModule
Import **`NavInkbarModule`** into a module which declares a component intended to use `wm-router-inkbar` tag.


```typescript
import { NavInkbarModule } from '@wizdm/elements';

```
---

## Directives

| **Properties** | **Description**                                                                |
| :------------- | :----------------------------------------------------------------------------- |
| wmInkbarIf     | Uses the **InkbarDirective** to drag the inkbar whenever a menu link is active |


&nbsp;  

# Attributes

| **Properties**         | **Description**                                                                                                                                                     |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| @Input() color: string | Set current color using the angular material **ThemePallete** value                                                                                                 |
| @Input() side: string  | When set it displays the inkbar at the specified position on the active tab element. Default to *bottom*. You can set value to be **left \| top \|right \| bottom** |

 

&nbsp;  


**Blog Post**
Link to a helpful post by the Wizdm author on medium:
[Animating UI Elements in Angular #1]('https://medium.com/wizdm-genesys/animating-ui-elements-in-angular-1-ae3fc3cadb1b')

 
->
[Continue Next](docs/toc?go=next) 
->  