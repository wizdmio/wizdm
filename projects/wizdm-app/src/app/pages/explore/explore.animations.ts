import { trigger, state, animate, style, transition, query, stagger, animateChild } from '@angular/animations';

const $timing = '450ms cubic-bezier(.8, -0.6, 0.2, 1.5)';

export let $animations = [

  trigger('fade', [
    transition('* => *', [
      style({ opacity: '0'}),
      animate($timing, style('*'))  
    ])
  ]),

  trigger('list', [
    transition('* => *', [
      query('@item', stagger(100, animateChild()), { optional: true })
    ]),
  ]),

  trigger('item', [
    transition(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 }),
      animate($timing, 
        style({ transform: 'scale(1)', opacity: 1 }))
    ])/*,

    transition(':leave', [
      style({ transform: 'scale(1)', opacity: 1 }),
      animate($timing, 
      style({ 
        transform: 'scale(0.5)', opacity: 0
      })) 
    ])*/
  ])
]