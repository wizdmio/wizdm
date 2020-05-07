# Animate 
Animate is an Angular package providing a directive-like component designed to animate its transcluded content. The animation can be selected among a series of attention seekers, entrances and exists inspired by the famous [Animate.css](https://daneden.github.io/animate.css/). The main purpose of the package, however, is to trigger the selected animation when the element is scrolling into the view.  

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
