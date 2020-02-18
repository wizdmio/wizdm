import { trigger, animate, style, transition } from '@angular/animations';

const $timing = '500ms ease';//cubic-bezier(0.5,0.5,0.5,1.0)';

export let $animations = [

  trigger('vanish', [
    transition('* => *', [
      style({ opacity: '0'}),
      animate($timing, style('*'))  
    ])
  ]),

  trigger('morph', [
    transition(':enter', [
      style({ 
        opacity: '0', 
        height: '0',
        transform: 'scaleY(0) rotateX(90deg)'
      }),
      animate($timing, style('*'))
    ]),
    transition(':leave', [
      animate($timing, style({ 
        opacity: '0', 
        height: '0',
        transform: 'scaleY(0) rotateX(90deg)'
      }))
    ])
  ])
];