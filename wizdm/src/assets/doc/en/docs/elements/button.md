<!-- toc: docs/reference.json -->

# Button
[Go to the API Reference](#api-reference)

`type` Directive is dynamic type change for MatButton. You can use this directive on `mat-button` to update some MatButton properties to reflect a new look.

## Usage example
```html 
<button mat-button [color]="color" type="icon">


```
The example above uses  `button` tag with a `mat-button` attribute set on it to give the look and feel of [angular material design for buttons](https://material.angular.io/components/button/overview). With `type` directive provided by `@wizdm/elements/button` you can instruct the `mat-button` to you use a specific type (as described in the [Button Types](#button-types)) dynamically.

# API Reference
[ButtonChangerModule](#buttonmodule) - [ButtonTypeChanger](#buttondirective) 

&nbsp;  

## buttonModule 

```typescript
import { ButtonChangerModule } from '@wizdm/elements/button';
```

## ButtonComponent

```typescript
@Directive({
  selector: '[mat-button][type]',
  exportAs: 'wmButtonType'
})
export class ButtonTypeChanger {
  @Input() type: string
}
```
&nbsp;

### Button Types

```typescript

export type ButtonType = basic | raised | stroked | flat | icon | fab | mini-fab;

```
&nbsp;


| **Properties** | **Description**                                                                |
| :------------- | :----------------------------------------------------------------------------- |
| `@Input() type`  | Set attribute to trigger change dynamically on the current `mat-button ` attribute. Default to *basic* when not defined. |

&nbsp;

--- 
->
[Continue Next](docs/toc?go=next) 
->
 