<!-- toc: docs/reference.json -->

# Highlight
[Go to the API Reference](#api-reference)

This feature gives you the ability to call the attention of the user's of your application to vital information with a perfect blend to existing design/colors.

## Usage example  

&nbsp;  

# API Reference
[HighlightModule](#highlightmodule) - [HighlightComponent](#highlightcomponent) 

## HighlightModule
&nbsp;

```typescript
import { HighlightModule } from '@wizdm/elements/highlight';


```

&nbsp;

## HighlightComponent
&nbsp;
```typescript

@Component({
  selector: '[wm-highlight]',
})
export class HighlightComponent implements OnChanges {
  readonly tokens: (string|{ highlight: boolean, content: string })[] = [];

  @Input() pattern: string|RegExp
  @Input('wm-highlight') source: string;
  @Input() color: ThemePalette;

  ngOnChanges(changes: SimpleChanges) {}
  
}

```

## Attributes

| **Properties**                     | **Description**                                                           |
| :--------------------------------- | :------------------------------------------------------------------------ |
| @Input() wm-hightlight             |  Set on container element, to highlight the content of the element. |
| @Input() color: string             | style element in terms of the current theme color property                |
  
&nbsp;  

---
->
[Continue Next](docs/toc?go=next) 
->
