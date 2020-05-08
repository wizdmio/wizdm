<!-- toc: reference.json -->

# Content 

[Go to the API Reference](docs/content#api-reference)

Runtime content management by the [Angular Router](https://angular.io/api/router/Router). The package provides a set of features for automatically install content resolvers to load json files from assets while routing lazily loaded modules. The content is then rendered accessible within the same module components' template via the `wmContent` structural directive.

## Usage example
Use the `wmContent` structural directive to select the relevant content within the template: 

```html
<!-- Use wmContent to select the relevant data -->
<ng-container *wmContent="let msgs select 'home'"> 

  <h1>{{ msgs.title || 'Get your app done right' }}</h1>

  <p>{{ msgs.body || 'Wizdm provides all the key features of a modern single page application ready to use' }}</p>
  
  <button mat-raised-button color="accent" [routerLink]="msgs.action?.link">{{ msgs.action?.caption || 'Get started' }}</button>

</ng-container>
```

---

Includes the `content` in the routes using the `ContentRouterModule` in place of the regular `RouterModule` in the lazy loaded child modules:

```typescript
// HomeModule.ts
...
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'home',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    ...,
    ContentRouterModule.forChild(routes)
  ]
})
export class HomeModule { }
```

The package is designed to provide runtime content in multiple languages selecting the proper language by means of a route parameter placed at the very root of the url like https://mycooldomain.io/**en**/home” for English and “https://mycooldomain.io/**it**/home” for italian:

->
![Routing Diagram](assets/docs/images/routing-diagram.png#80)
<-

&nbsp;  

# API Reference
[ContentModule](docs/content#contentmodule) - [AnimateComponent](docs/aos#animatecomponent) - [AnimateDirective](docs/aos#animatedirective) - [AnimateService](docs/aos#animateservice)  

&nbsp;  

## ContentModule 

```typescript
import { ContentModule } from '@wizdm/content';
```

The main module provides an optional `init()` static function to customize the module behvior:
```typescript
static init(config?: ContentConfig): ModuleWithProviders<ContentModule>
```
**config**
```typescript
export interface ContentConfig {
  selector?: string;
  source?: string;
  defaultValue?: string;
  supportedValues?: string[];
}
```
|**Value**|**Description**|
|:--|:--|
|`'selector: string`|The route parameter used to catch the language. Defaults to 'lang' when unspecified|
|`source: string`|The path from wich the loader will load the content files. Defaults to 'assets/i18n' when unspecified|
|`defaultValue: string`|The defaultl selector value to be used when none is provided by the current route. Defaults to 'en' when unspecified|
|`supportedValues: string[]`|An array of possible selector values to accept as valid. Any selector values not matching one of the suported ones will be automatically reverted to the `defaultValue`|

&nbsp;  

## AnimateComponent
The `wmAnimate` component enables the animation of the target element.

```typescript
@Component({
 selector: '[wmAnimate]',
 template: '<ng-content></ng-content>',
 animations: [...]
})
export class AnimateComponent {

  public animating;
  public animated;

  @Input('wmAnimate') animate: wmAnimations;
  @Input() set speed(speed: wmAnimateSpeed);
  @Input() set delay(delay: string);
  @Input() disabled: boolean;
  @Input() paused: boolean;
  @Input() set aos(threashold: number);
  @Input() once: boolean;
  @Input() set replay(replay: any);
  
  @Output() start: EventEmitter<void>;  
  @Output() done: EventEmitter<void>; 
}
```

|**Properties**|**Description**|
|:--|:--|
|`animating: boolean`|**True** when the animation is running|
|`animated: boolean`|**True** after the animation completed. False while the animation is running|
|`@Input() wmAnimate: wmAnimations`|Selects the animation to play. See [supported animations](docs/aos#supported-animations)| 
|`@Input() set speed(speed: wmAnimateSpeed)`|Speeds up or slows down the animation. See [timing](docs/aos/#timing)|
|`@Input() set delay(delay: string)`|Delays the animation execution. See [timing](docs/aos/#timing)|
|`@Input() disabled: boolean`|Disables the animation|
|`@Input() paused: boolean`|When **true**, keeps the animation idle until the next replay triggers|
|`@Input() set aos(threshold: number)`|When defined, triggers the animation on element scrolling in the viewport by the specified amount. Amount defaults to 50% when not specified. See [Animate On Scroll](docs/aos#animate-on-scroll)|
|`@Input() once: boolean`|When **true**, prevents the animation to run again|
|`@Input() set replay(replay: any)`|Replays the animation|
|`@Output() start: EventEmitter<void>`|Emits at the beginning of the animation|
|`@Output() done: EventEmitter<void>`|Emits at the end of the animation|  

&nbsp;  

## AnimateDirective
The `wmAnimateView` directive to customize the triggering viewport.

```typescript
@Directive({
  selector: '[wmAnimateView]'
})
export class AnimateDirective {

  @Input() useElement: boolean;
  @Input() top: number;
  @Input() left: number;
  @Input() bottom: number;
  @Input() right: number;
}
```

|**Properties**|**Description**|
|:--|:--|
|`@Input() useElement: boolean`|When **true** uses the element's bounding rect as the animation view|
|`@Input() top: number`|Optional top offset|
|`@Input() left: number`|Optional left offset|
|`@Input() bottom: number`|Optional bottom offset|
|`@Input() right: number`|Optional right offset|  

&nbsp;  

## AnimateService
The service providing the triggering logic.

```typescript
@Injectable({
  providedIn: 'root'
})
export class AnimateService {

  public get useIntersectionObserver(): boolean;
  public get useScrolling(): boolean;

  public setup(options: AnimateOptions);
  public trigger(elm: ElementRef<HTMLElement>, threshold: number): OperatorFunction<boolean, boolean>;
}
```

|**Properties**|**Description**|
|:--|:--|
|`get useIntersectionObserver(): boolean`|**True** when the trigger is provided using the IntersectionObserver API|
|`get useScrolling(): boolean`|**True** when the trigger is provided using cdk/scrolling package|

### Methods

---

```typescript
public setup(options: AnimateOptions)
```
Configures the service with the given **options**:

```typescript
export interface AnimateOptions {
  
  root?: Element;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}
```

* `root`: An optional element which bounding rectanlge will be used as the animation view. When undefined or null, the overall viewport will be used.
* `left`: An offset, expressed in **pixels**, to shrink the triggering area from the left with. This value overrides the global `offsetLeft` value.
* `top`: An offset, expressed in **pixels**, to shrink the triggering area from the top with. This value overrides the global `offsetTop` value.
* `right`: An offset, expressed in **pixels**, to shrink the triggering area from the right with. This value overrides the global `offsetRight` value.
* `bottom`: An offset, expressed in **pixels**, to shrink the triggering area from the bottom with. This value overrides the global `offsetBottom` value.

---

```typescript
public trigger(elm: ElementRef<HTMLElement>, threshold: number): OperatorFunction<boolean, boolean>
```
Observable operator to be used for triggering the animation on scroll. 
* `elm`: The element for which the animation will be triggered.
* `threshold`: The visibility ratio to trigger the animation with. 

The returned `OperatorFunction` accepts an input trigger to emit an output trigger. In case the threshold value is 0, the output trigger simply mirrors the input one. For values greater than 0, the service checks the given element's area against the animation view emitting **true** when the two rectangles intersect for an area equal or greater than the threshold value, emitting **false** when the element's area is totally out of the view area. 

---
->
[Next Topic](docs/toc?go=next) 
->
