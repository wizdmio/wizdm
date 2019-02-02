import { trigger, state, animate, style, transition, query, group, animateChild } from '@angular/animations';

const $timing1 = '350ms ease-out';
const $timing2 = '200ms ease-out';

export let $animations = [

    trigger('blendin', [
        state('false', style('*')),
        state('true', style({
            //height: '120%', 
            opacity: 0 
        })),
        transition('false <=> true', //group([
            animate('450ms ease'),
            //query('@*', animateChild(), { optional: true })
        )//]))
    ]),
/*
    trigger('flip', [
        transition('* => *', [
            query(':enter', style({ transform: 'rotateY(-90deg)' })),
            query(':leave', [
                animate('200ms ease-out', style({ transform: 'rotateY(90deg)' }))
            ], { optional: true }),
            query(':enter', [
                animate('200ms ease-out', style({ transform: 'rotateY(0)' }))
            ], { optional: true })
        ])
    ])/*,

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

  ])*/
];