<!-- toc: docs/reference.json -->

# Spinner

[Go to the API Reference](#api-reference)

A responsive spinner component to automatically fit into the parent container.  `wm-spinner` is a circular indicator of progress and activity in an application. You can use this component to simulate a state for processing user's request by displaying `wm-spinner`.

## Usage example

```html
<wm-spinner size="100" color="warn" strokeWidth="5"></wm-spinner>

```
You have access to the size property, color property of the theme class, and the strokeWidth attribute on the component.
Also, you can customize these attributes as described in the [attributes section](#attributes).

&nbsp;  



&nbsp;  
# API Reference
[SpinnerModule](#spinnermodule) - [SpinnerComponent](#spinnercomponent)


## SpinnerModule 
```typescript
import { SpinnerModule } from '@wizdm/elements/spinner';

```

## SpinnerComponent 
```typescript

@Component({
  selector: 'wm-spinner',
})
export class SpinnerComponent {

  @Input() color: ThemePalette = 'accent';
  @Input() size: number;
  @Input() strokeWidth: number;
}

```

## Attributes

| **Properties**                 | **Description**                                                                                         |
| :----------------------------- | :------------------------------------------------------------------------------------------------------ |
| @input() size: number          | Set the width on the **wm-spinner** tag                                                                 |
| @input()   color: string       | Set color property value from the theme pallete option                                                  |
| @input()   strokeWidth: number | This attribute is a presentation attribute defining the width of the stroke to be applied to the shape. |
  

&nbsp;

---

->
[Continue Next](docs/toc?go=next) 
->
