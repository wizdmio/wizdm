import { trigger, state, animate, style, transition, query, stagger, group, animateChild } from '@angular/animations';

export let $animations = [

  // Toolbar background blend-in
  trigger('blendin', [
    state('false', style('*')),
    state('true', style({ opacity: 0 })),
    transition('false <=> true', //group([
      animate('450ms ease'),
      //query('@*', animateChild(), { optional: true })
    )//]))
  ]),

  // Actionbar item activation
  trigger('actionbar', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0 }),
        stagger('-100ms', 
          animate('250ms ease-out', style('*'))
        )
      ], { optional: true })
    ])
  ]),

  trigger('sidenav', [
    transition(':enter',[
      style({ opacity: 0, transform: 'translateX(-20px)' }),
      animate('450ms cubic-bezier(0.8, -0.5, 0.2, 1.5)')
    ]),
    transition(':leave', 
      animate('450ms cubic-bezier(0.8, -0.5, 0.2, 1.5)', 
        style({ opacity: 0, transform: 'translateX(-20px)' })
      )
    )
  ])
];