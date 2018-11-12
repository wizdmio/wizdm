import { trigger, state, animate, style, transition, query, stagger, animateChild } from '@angular/animations';

const $timing = '350ms ease-out';

export let $animations = [

  trigger('levitate', [
      state('true',  style({ boxShadow: '0 0 6px rgba(0,0,0,0.5)' })),
      state('false', style({ boxShadow: '0 0 0px rgba(0,0,0,0.5)' })),
      transition('true <=> false', animate($timing))
  ]),

  trigger('expand', [
    state('true',  style({ height: '40px' })),
    state('false', style({ height: 0 })),
    transition('true <=> false', animate($timing)),
/*    
    transition(':enter', [
        style({ height: 0 }),
        animate($timing, style('*'))
    ]),
    
    transition(':leave', [
        animate($timing, style({ height: 0 }))
    ])
*/
  ])
];