<!-- toc: reference.json -->

# Avatar 

[⬇ Go to the API Reference](docs/elements-avatar#api-reference) 

The `wm-avatar` element is a small component to display the given avatar image. In the event the provided url were null or refers to an invalid or no longer existing image, the component displays a generic icon-like symbol instead. 

## Usage example
The component can be easily used like an `<img />` element or a `<mat-icon>` component: 

```html
<!-- Starts with a material icon button -->
<button mat-icon-button (click)="doSomething()">

  <!-- Use the wm-avatar component like an icon -->
  <wm-avatar [src]="pathToImage" color="accent" shape="rounded"></wm-avatar>

</button>
```
In the example above, we are using the `wm-avatar` component within a `mat-icon-button`.
This component provides two types of shape that can be applied on the attribute **shape**:
- rounded
- squared

&nbsp;  

## Attributes

| **Properties**         | **Description**                                                 |
| :--------------------- | :-------------------------------------------------------------- |
| @Input() shape: string | attribute value set on the  `wm-avatar`. Default to **rounded** |
| @Input() color: string | element can be colored in terms of the current theme value      |


&nbsp;  

# API Reference

[AvatarModule](docs/elements-avatar#avatarmodule) - [AvatarComponent](docs/elements-avatar#avatarcomponent) 

&nbsp;  

## AvatarModule 

```typescript
import { AvatarModule } from '@wizdm/elements/avatar';
```

--- 
->
[Continue Next ⮕](docs/toc?go=next) 
->                  