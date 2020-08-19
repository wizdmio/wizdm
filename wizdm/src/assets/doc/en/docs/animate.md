<!-- toc: docs/reference.json -->

# Animate 

[Go to the API Reference](#api-reference)

Animate is a package providing a directive-like component designed to animate its transcluded content. The animation can be selected among a series of attention seekers, entrances and exists inspired by the famous [Animate.css](https://daneden.github.io/animate.css/). The main purpose of the package, however, is to trigger the selected animation when the element is scrolling into the view.  

## Usage example
Start by adding the `wmAnimate` directive to the element you want to animate. The `aos` flag is then used to enable the "Animate On Scroll" triggering mechanism: 

```html
<section wmAnimate="landing" aos> 
  My animated content goes here
</section>
```

## Supported animations
Animations are grouped in three catetgories: Attention seekers, Entrances and Exists.

### Attention seekers
Attention seekers animate starting and ending with the original element's style. Possible values are: 

`beat`, `bounce`, `flip`, `headShake`, `heartBeat`, `jello`, `pulse`, `rubberBand`, `shake`, `swing`, `tada`, `wobble`.

### Entrances
Entrances start with opacity level set to '0' (invisible) and animate ending with the original element's style. Possible entrance values are: 

`bumpIn`, `bounceIn`, `bounceInDown`, `bounceInLeft`, `bounceInUp`, `bounceInRight`, `fadeIn`, `fadeInRight`, `fadeInLeft`, `fadeInUp`, `fadeInDown`, `flipInX`, `flipInY`, `jackInTheBox`, `landing`, `rollIn`, `zoomIn`, `zoomInDown`, `zoomInLeft`, `zoomInUp`, `zoomInRight`.

### Exists
Exits start from the original element's style ending with the opacity level set to '0' (invisible). Possible exit values are: 

`bounceOut`, `bounceOutDown`, `bounceOutUp`, `bounceOutRight`, `bounceOutLeft`, `fadeOut`, `fadeOutRight`, `fadeOutLeft`, `fadeOutDown`, `fadeOutUp`, `hinge`, `rollOut`, `zoomOut`, `zoomOutDown`, `zoomOutRight`, `zoomOutUp`, `zoomOutLeft`.

## Trigger
The animation will trigger as soon as the component renders if not specified otherwise. 

### Replay
The animation can be triggered again using the `replay` input. Every change in this input value will trigger the animation again provided the value can be coerced into a truthful boolean. Use the `paused` flag to prevevnt the animation from triggering at first in order to get the full control about when the triggering will happen.  

### Animate On Scroll
Setting the `aos` flag enables the "Animate On Scroll" mechanism with a default threshold of `0.5`, so, the animation triggers as soon as the 50% of the element area intersects the viewport area. The triggering threshold can be customized setting the `aos` input to a different numeric value from `0` (escluded) up to `1` (included). Setting `aos=0` disables the trigger. 

When the element scrolls out completely, the trigger resets, so, the animation will trigger as soon as the element enters the visible portion of the viewport again. Use the `once` flag to prevent the trigger to reset for the animation to run just once.

## Timing
By default every animation applies the optimal timing. However, timing can be overridden with the `speed` input. Possible values are:
* `slower`: running the animation with a **3s** timing
* `slow`: running the animation with a **2s** timing
* `normal`: running the animation with a **1s** timing
* `fast` : running the animation with a **500ms** timing
* `faster`: running the animation with a **300ms** timing 

Additionally, the animation can be delayed using `delay` input. The input accepts both a string describing the delay such as '1s' or '250ms' or a number that will be considered a delay expressed in **ms**.

## Viewport
When `aos` is enabled each animated element's area is checked against the viewport area to evaluate its visibility ratio and trigger the animation accordingly. 

The triggering area can optionally be adjusted, so, to shrink (or expand) the effective area by `left`, `top`, `right` and `bottom` margins:

```html
<div class="container" wmAnimateView top="64">

  <section wmAnimate="landing" aos> 
    My animated content goes here
  </section>
  ...
</div>
```

By using the `wmAnimateView` directive on a parent container in the example above, the effective triggering area has been reduced by a 64 pixels offset from the top of the viewport. 

Alternatively, by setting the `useElement` flag, the container's client bounding box will be used as the triggering area instead of the viewport: 

```html
<div class="container" wmAnimateView useElement top="64">

  <section wmAnimate="landing" aos> 
    My animated content goes here
  </section>
  ...
</div>
```

The customizations above will affect the container's children elements only, so, different triggering areas can be used for different containers. 

&nbsp;  

# API Reference
[AnimateModule](#animatemodule) - [AnimateComponent](#animatecomponent) - [AnimateDirective](#animatedirective) - [AnimateService](#animateservice)  

&nbsp;  

## AnimateModule 

```typescript
import { AnimateModule } from '@wizdm/animate';
```

Import the AnimateModule in your modules to enable on scroll animations. Use the static `init()` function within your root module to setup the module according to your needs.

```typescript
@NgModule({
  exports: [ AnimateComponent, AnimateDirective ]
})
export class AnimateModule { 

  static init(config: AnimateConfig): ModuleWithProviders<AnimateModule>;

}
```

### Methods

---

```typescript
static init(config?: AnimateConfig): ModuleWithProviders<AnimateModule>
```
Static module initialization function to customize the module behavior. It returns the customized module instance.
* `config: AnimateConfig` - the configuration object.
```typescript
interface AnimateConfig {
  triggerMode?: 'scrolling'|'intersectionObserver'|'auto';
  offsetTop?: number;
  offsetLeft?: number;
  offsetRight?: number;
  offsetBottom?: number;
}
```
* `triggerMode`: Specifies wich mechanism is going to be used for trigggering the animations while scrolling.

|**Value**|**Description**|
|:--|:--|
|`'scrolling'`|Computes the visibility upon scrolling with the help of the [CdkScrolling](https://material.angular.io/cdk/scrolling/overview) package. In order to work the animate elements must belong to the main scrolling window or within a `cdkScrollable` child container|
|`'intersectionObserver'`|Triggers the animation with the help of the [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), whenever available. In the unlikely event the browser does not support this API, the triggering service will revert to the `scrolling` method|
|`'auto'`|(The default value). Tells the package to check for the best mode to be used|

* `offsetTop?: number` - A global offset, expressed in **pixels**, to shrink the triggering area from the top with.
* `offsetLeft?: number` - A global offset, expressed in **pixels**, to shrink the triggering area from the left with.
* `offsetRight?: number` - A global offset, expressed in **pixels**, to shrink the triggering area from the right with.
* `offsetBottom?: number` - A global offset, expressed in **pixels**, to shrink the triggering area from the bottom with.  

---

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
|`@Input() wmAnimate: wmAnimations`|Selects the animation to play. See [supported animations](#supported-animations)| 
|`@Input() set speed(speed: wmAnimateSpeed)`|Speeds up or slows down the animation. See [timing](#timing)|
|`@Input() set delay(delay: string)`|Delays the animation execution. See [timing](#timing)|
|`@Input() disabled: boolean`|Disables the animation|
|`@Input() paused: boolean`|When **true**, keeps the animation idle until the next replay triggers|
|`@Input() set aos(threshold: number)`|When defined, triggers the animation on element scrolling in the viewport by the specified amount. Amount defaults to 50% when not specified. See [Animate On Scroll](#animate-on-scroll)|
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

* `root?: Element` - An optional element which bounding rectanlge will be used as the animation view. When undefined or null, the overall viewport will be used.
* `left?: number` - An offset, expressed in **pixels**, to shrink the triggering area from the left with. This value overrides the global `offsetLeft` value.
* `top?: number` - An offset, expressed in **pixels**, to shrink the triggering area from the top with. This value overrides the global `offsetTop` value.
* `right?: number` - An offset, expressed in **pixels**, to shrink the triggering area from the right with. This value overrides the global `offsetRight` value.
* `bottom?: number` - An offset, expressed in **pixels**, to shrink the triggering area from the bottom with. This value overrides the global `offsetBottom` value.

---

```typescript
public trigger(elm: ElementRef<HTMLElement>, threshold: number): OperatorFunction<boolean, boolean>
```
Observable operator to be used for triggering the animation on scroll. 
* `elm: ElementRef<HTMLElement>` - The element for which the animation will be triggered.
* `threshold: number` - The visibility ratio to trigger the animation with. 

The returned `OperatorFunction` accepts an input trigger to emit an output trigger. In case the threshold value is 0, the output trigger simply mirrors the input one. For values greater than 0, the service checks the given element's area against the animation view emitting **true** when the two rectangles intersect for an area equal or greater than the threshold value, emitting **false** when the element's area is totally out of the view area. 

---
->
[Next Topic](docs/toc?go=next) 
->
