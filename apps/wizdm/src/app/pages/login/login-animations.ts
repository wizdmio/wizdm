import { trigger, animate, style, transition } from '@angular/animations';

let $timing = '400ms cubic-bezier(0.5,0.5,0.5,1.0)';

export let $loginAnimations = [

  trigger('vanish', [
    transition('* => *', [
      style({ opacity: '0'}),
      animate($timing, style('*'))  
    ])
  ]),

  trigger('inflate', [
    transition(':enter', [
      style({ 
        opacity: '0', 
        height: '0',
        transform: 'rotateX(90deg)'
      }),
      animate($timing, style('*'))
    ]),
    transition(':leave', [
      animate($timing, style({ 
        opacity: '0', 
        height: '0',
        transform: 'rotateX(90deg)'
      }))
    ])
  ])
];