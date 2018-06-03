import { trigger, state, animate, style, transition, keyframes, group, query, stagger } from '@angular/animations';

//const themeTiming = '0.5s cubic-bezier(0.5, 0.5, 0.5, 1.0)';
const logoTiming = '3.5s linear';

export let logoAnimations = [
/*
  trigger('color', [
    state('*', style({ color: '{{color}}' }),{ params: { color: '#F1F1F1'}}),
    transition('* => *', animate(themeTiming))
  ]),
*/
  trigger('logo', [
    transition(':enter', [
  
      query('h1',
        style({
          transform: 'translateY(-999px) rotateY(-90deg)',
          //transform: 'rotateY(-90deg)',
          textShadow: '0px 999px 20px',
          //textShadow: '0px 0px 50px #000',
          letterSpacing: '10px'//,
          //opacity: 0
        })
      ),

      query('h1',
        animate(logoTiming,
          style({
            transform: 'translateY(-999px) rotateY(0)',
            //transform: 'rotateY(0)',
            textShadow: '0px 999px 0px',
            //textShadow: '0px 0px 0px #000',
            letterSpacing: '*'//,
            //opacity: '*'
          })
        )
      )
    ])
  ])
]
