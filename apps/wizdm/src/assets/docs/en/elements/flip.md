<!-- toc: reference.json -->

# Flip Animation

[Go to the API Reference](#api-reference)

You can bring your site to life using flawless animation at the early stage of development. **Wizdm Flip Animation** is absolutely fantastic for times where you are responding to user input and then animating something in response. This feature can be used to achieve smooth transition funtionality, informing the users of your application about the current state of the page or session.




## Usage example
A typical use case for  `wm-flip` element toggling between state of user's authentication profile icon/avatar using `mat-icon-button`.

```html
<!-- Using a button as the flipping container -->
<button mat-icon-button (click)="flip = !flip">

  <!-- Here the flipping component -->
  <wm-flip [flipped]="flip">

    <!-- Content rendered on the front (flipped = 'false') -->
    <wm-icon front icon="fas:fa-sign-in-alt"></wm-icon>

    <!-- Content rendered on the back (flipped = 'true') -->
    <wm-avatar back color="accent"></wm-avatar>

  </wm-flip>

</button>
```

&nbsp;  

&nbsp;  

## Attributes

| **Properties**                        | **Description**                                                                            |
| :------------------------------------ | :----------------------------------------------------------------------------------------- |
| @Input('flipped') flipping: boolean | Triggers animation to invert element                                                       |
| front                               | Place on the content in the first state. When flipped attribute is set **false** |
| back                                | Place  on the content in the last state. When flipped directive is set **true**   |
  
&nbsp;  

# API Reference
```typescript
import { FlipModule } from '@wizdm/elements';

```


--- 
->
[Continue Next](docs/toc?go=next) 
->  