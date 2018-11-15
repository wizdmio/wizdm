import { trigger, state, animate, style, transition, query, group, animateChild } from '@angular/animations';

const $timing = '350ms ease-out';

export let $animations = [

    trigger('blendin', [
        state('false', style('*')),
        state('true', style({
          height: '120%', 
          opacity: 0 
        })),
        transition('false <=> true', group([
          animate($timing),
          query('@*', animateChild(), { optional: true })
        ]))
      ]),

  trigger('levitate', [
      state('true',  style({ boxShadow: '0 0 6px rgba(0,0,0,0.5)' })),
      state('false', style({ boxShadow: '0 0 0px rgba(0,0,0,0.5)' })),
      transition('true <=> false', animate($timing))
  ]),

  trigger('expand', [
    state('true',  style({ height: '*' })),
    state('false', style({ height: 0 })),
    transition('true <=> false', animate($timing)),

    transition(':enter', [
        style({ height: 0 }),
        animate($timing, style({ height: '*' }))
    ]),
    
    transition(':leave', [
        animate($timing, style({ height: 0 }))
    ])

  ])
];