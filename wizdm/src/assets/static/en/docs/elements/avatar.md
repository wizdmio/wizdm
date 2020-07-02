<!-- toc: docs/reference.json -->

# Avatar 

[Go to the API Reference](#api-reference) 

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

# API Reference

[AvatarModule](#avatarmodule) - [AvatarComponent](#avatarcomponent) 

&nbsp;  

## AvatarModule 

```typescript
import { AvatarModule } from '@wizdm/elements/avatar';
```

## AvatarComponent

```typescript
@Component({
  selector: 'wm-avatar'
})
export class AvatarComponent {

  public load: boolean;
  public url: string;

  @Input() src: string;
  @Input() alt: string;
  @Input() color: ThemePalette;
  @Input() shape: 'rounded'|'squared';
}
```

| **Properties**           | **Description**                                                |
| :----------------------- | :------------------------------------------------------------- |
| `load: boolean`          | **True** once the requested image has been load. When **false** the generic avatar is displayed instead |
| `url: string`            | The source url to load the avatar image from |
| `@Input() src: string;`  | The source input to load the avatar image from. This reflects into *url* property as well|
| `@Input() shape: string` | shape value set on the `wm-avatar`. Default to **rounded** |
| `@Input() color: ThemePalette` | element can be colored in terms of the current theme value |

--- 
->
[Continue Next](docs/toc?go=next) 
->
