<!-- toc: reference.json -->

# Balloon

[Go to the API Reference](#api-reference)

Balloon is an Angular component that allows for the usage of customized Tooltip feature in your application. Wizdm Balloon provide a very easy way to dynamically display information when user's mouse hovers over balloon's trigger elements  and immediately hides when the user's mouse leaves.


## Usage example
```html
<wm-balloon [side]="left" [anchor]="center" [color]="accent"></wm-balloon>

```

## Attributes

| **Properties**  | **Description** |
| :-------------- | :-------------- |
| @Input() side: string   | When set it position's the balloon tooltip to display on the specified element in a certain direction. The options include **left \| top \| right \| bottom**. Default to *bottom* when not defined                |
| @Input() anchor: string |                 |
| @Input() color: string  | Set current color using the angular material **ThemePallete** value                 |

  
&nbsp;  


# API Reference
```typescript
import { BallonModule } from '@wizdm/elements/balloon'

```
---
->
[Continue Next](docs/toc?go=next) 
->  