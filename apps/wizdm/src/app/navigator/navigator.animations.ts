import { trigger, state, animate, style, transition, query, stagger, group, animateChild } from '@angular/animations';

export let $animations = [

    trigger('blendin', [
        state('false', style('*')),
        state('true', style({ opacity: 0 })),
        transition('false <=> true', //group([
            animate('450ms ease'),
            //query('@*', animateChild(), { optional: true })
        )//]))
    ]),
    trigger('activate', [
        transition('* => *', [
          query(':enter', [
            style({ opacity: 0 }),
            stagger('-100ms', 
              animate('250ms ease-out', style('*'))
            )
          ], { optional: true })
        ])
      ])
];