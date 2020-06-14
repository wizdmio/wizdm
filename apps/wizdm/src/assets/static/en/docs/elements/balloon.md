<!-- toc: docs/reference.json -->

# Balloon

[Go to the API Reference](#api-reference)

Balloon is an Angular component that allows for the usage of customized Tooltip feature in your application. Wizdm Balloon provide a very easy way to dynamically display information when user's mouse hovers over balloon's trigger elements  and immediately hides when the user's mouse leaves.


## Usage example
```html
<wm-balloon [side]="left" [anchor]="center" [color]="accent"></wm-balloon>

```

  
&nbsp;  


# API Reference

[BalloonModule](#balloonmodule) - [BalloonComponent](#ballooncomponent) 

&nbsp;  

## BalloonModule 

```typescript
import { BalloonModule } from '@wizdm/elements/balloon';
```

## BalloonComponent

```typescript
@Component({
  selector: 'wm-balloon'
})
export class balloonComponent {

  @Input() side: string
  @Input() anchor: string
  @Input() color: ThemePalette;
}
```
---


## Attributes

| **Properties**          | **Description**                                                                                                                                                       |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @Input() side: string   | Specifies the position of the Tooltip in relation to the anchor element. The options include **left \| top \| right \| bottom**. Default to *bottom* when not defined |
| @Input() anchor: string | Use attribute to show pointer arrow for the Tooltip element. The options include **start \| center \| end**                                                                                                                          |
| @Input() color: string  | Set current color using the angular material **ThemePallete** value                                                                                                   |

---
->
[Continue Next](docs/toc?go=next) 
->
