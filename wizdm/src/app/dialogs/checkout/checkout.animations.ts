import { trigger, animate, style, transition } from '@angular/animations';

const $timing = '500ms ease';

export let $animations = [

  trigger('error', [
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