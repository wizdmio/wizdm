import { trigger, state, animate, style, transition, query, stagger, animateChild } from '@angular/animations';

const $timing = '200ms ease-out';

export let $animations = [

    trigger('expand', [
        state('true',  style('*')),
        state('false', style({ height: 0 })),
        transition('true <=> false', animate($timing)),
        
        transition(':enter', [
            style({ height: 0 }),
            animate($timing, style('*'))
        ]),
        
        transition(':leave', [
            animate($timing, style({ height: 0 }))
        ])
    ]),

    trigger('fadeIn', [
        transition(':enter', [
            style({ opacity: 0}),
            animate($timing, style('*'))
        ])
    ]),

    trigger('fadeInSequence', [
        transition('* => *', [
            query('@fadeIn', 
                stagger(-50, animateChild() )
            )
        ])
    ])
]
