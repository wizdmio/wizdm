<!-- toc: docs/reference.json -->

# Illustration

[Go to the API Reference](#api-reference)

**`wm-illustration`** provides out of the box the ability to loading svg to blend-in with the application colors/design. You can use this element to add **svg** to your page not having to do much in customizing the color as provided by ThemePallete from Angular Material.

## Usage example
```html
<wm-illustration src="assets/img/blue-buddha.svg" [color]="primary"></wm-illustration>
```
The usage of this component gives you the flexibility of dynamically loading svg on your page and setting the current color base on the font color `currentColor`. 

&nbsp;  

# API Reference
[IllustrationModule](#illustrationmodule) - [IllustrationComponent](#illustrationcomponent) - [Theming](#theming)

## IllustrationModule
&nbsp;  

```typescript
import { IllustrationModule } from '@wizdm/elements/illustration';

```
&nbsp;  

## IllustrationComponent
&nbsp;

```typescript
@Component({
  selector: 'wm-illustration',
})
export class IllustrationComponent {

  public svg$: Observable<SafeHtml>;

  @Input() src: string
  @Input() baseHref: string
  @Input() color: ThemePalette;

  @Output() load = new EventEmitter<void>();
  @Output() error = new EventEmitter<Error>();

}

```

&nbsp;  

## Attributes

| **Properties**                    | **Description**                                                            |
| :-------------------------------- | :------------------------------------------------------------------------- |
| @Input src: string                | Source path of the **SVG** to load                                         |
| @Input baseHref: string           | optional base **href** to prepend url('#someLink') tags with               |
| @Input color: string              | element can be colored in terms of the current theme using this property   |
| @Input disableAnimations: boolean | enable/Disable animation trigger when loading element. Default to **true** |

&nbsp;  

## Theming
By default, svg element will use the current font color (`currentColor`). This color can be changed to
match the current theme's colors using the `color` attribute. This can be changed to
`'primary'`, `'accent'`, or `'warn'`.

---

&nbsp;  

->
[Continue Next](docs/toc?go=next) 
-> 
