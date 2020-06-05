<!-- toc: reference.json -->

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

## Directives
&nbsp;

## Attributes 

| **Properties**                 | **Description**                                                      |
| :----------------------------- | :------------------------------------------------------------------- |
| @Input() toggler-style: string | attribute set on the  `wm-toggler`. Default to **menu**              |
| @Input() toggled: boolean      | set to **true/false** to keep track the state of the toggled element |
| @Input() color: string         | element can be colored in terms of the current theme property        |
  
&nbsp;  

# API Reference
```typescript
import { TogglerModule } from '@wizdm/elements/toggler';

```
---

->
[Continue Next](docs/toc?go=next) 
->  
