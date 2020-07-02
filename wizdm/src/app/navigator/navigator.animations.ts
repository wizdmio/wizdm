import { trigger, state, animate, style, transition, query, stagger, group, animateChild } from '@angular/animations';

export let $animations = [

  // Toolbar background blend-in
  trigger('backgndBlendin', [
    state('false', style('*')),
    state('true', style({ opacity: 0 })),
    transition('false <=> true', //group([
      animate('450ms ease'),
      //query('@*', animateChild(), { optional: true })
    )//]))
  ]),

  // Actionbar's activation of actions
  trigger('actionActivate', [
    transition('* => *', [
      query('button:enter, a:enter', [
        style({ opacity: 0 }),
        stagger('-100ms', 
          animate('250ms ease-out', style('*'))
        )
      ], { optional: true })
    ])
  ]),

  trigger('sidenavOn', [
    transition(':enter',[
      style({ opacity: 0, transform: 'translateX(-20px)' }),
      animate('450ms cubic-bezier(0.8, -0.5, 0.2, 1.5)')
    ]),
    transition(':leave', 
      animate('450ms cubic-bezier(0.8, -0.5, 0.2, 1.5)', 
        style({ opacity: 0, transform: 'translateX(-20px)' })
      )
    )
  ]),
/*
  trigger('sidenavOpen', [
    transition('* => *', group([ 
      query('@transform', animateChild(), { optional: true }  ),
      query('@sideToggler', animateChild(), { optional: true} )
    ]))
  ]),

  trigger('sideToggler', [
    state('true', style({ transform: 'none' })),
    state('false', style({ transform: 'translateX(8px) rotateZ(180deg)'})),
    transition('false <=> true', animate('450ms ease'))
  ]),*/
];