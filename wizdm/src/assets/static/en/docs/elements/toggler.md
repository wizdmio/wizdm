<!-- toc: docs/reference.json -->

# Toggler
[Go to the API Reference](#api-reference)

Animated toggler extending Angular Material components with selectable multiple styles.
**`wm-toggler`** element provide multiple menu styles in toggling the visibility of content. When toggled, the element comes into or out of view using angular material sidenav component.

## Usage example

```html
 <wm-toggler toggler-style="more_vert" [toggled]="menuState"></wm-toggler>
```

  `wm-toggler` provides right out of the box these three toggler-style property:

- menu: basic hamburger icon toggler
- more_vert: a three vertical dots animated toggler
- more_horiz: a three horizontal dots animated toggler

`menuState` is a boolean property defined in your component to track the state of the `wm-toggler`

&nbsp;

# API Reference
[TogglerModule](#togglermodule) -  [TogglerComponent](#togglercomponent)

## TogglerModule
```typescript
import { TogglerModule } from '@wizdm/elements/toggler';

```

## TogglerComponent
```typescript

export type wmTogglerStyle = 'menu' | 'more_vert' | 'more_horiz';

@Component({
  selector: 'wm-toggler',
})
export class TogglerComponent {

  public toggled = false;

  @Input('toggled') toggling: boolean;
  @Input() color: ThemePalette;
  @Input('toggler-style') style: wmTogglerStyle = 'menu';
  
  // Trigger the animations based on current style
  public get trigger() {}
}

```

## Attributes 

| **Properties**                 | **Description**                                                                  |
| :----------------------------- | :------------------------------------------------------------------------------- |
| @Input() toggler-style: string | attribute set on the  `wm-toggler` to select icon of choice. Default to **menu** |
| @Input() toggled: boolean      | set to **true/false** to keep track the state of the toggled element             |
| @Input() color: string         | element can be colored in terms of the current theme property                    |
  
&nbsp;  

---

->
[Continue Next](docs/toc?go=next) 
->  
