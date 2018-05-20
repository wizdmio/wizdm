import { trigger, state, animate, style, transition, keyframes, group, query, stagger, animateChild } from '@angular/animations';

const scrollTiming = '0.75s cubic-bezier(0.8, 0.0, 0.2, 1.0)';

export let scrollParams = {
/*
  scrollUp:   { enter: '100%', leave: '-100%'},
  scrollDown: { enter: '-100%', leave: '100%'}, 
*/
  scrollUp:   { enter: '100%', origin: 'top', rotate: '-30deg', offset: '-250px'},
  scrollDown: { enter: '-100%', origin: 'bottom', rotate: '30deg', offset: '250px'}, 
};

export let homeAnimations = [

  trigger('scroll', [
    transition('* => *', [

      query(':enter', [
        style({ 
          top: '{{enter}}',
          opacity: 0
        })
      ],{ optional: true }),

      query(':leave', [
        style({
          transformOrigin: '{{origin}}'
        })
      ],{ optional: true }),

      group([
        query(':enter', [
          group([
            animate(scrollTiming, style('*') ),
            query('@*', animateChild(),{ optional: true } )
          ])
        ],{ optional: true }),

        query(':leave', [
          animate(scrollTiming,
            style({
              transform: 'rotateX({{rotate}}) translateY({{offset}}) translateZ(-600px)',
              opacity: 0
            })
          )
        ],{ optional: true })
      ])
    ],{ params: scrollParams.scrollUp })
  ])

  /*
  trigger('scroll', [
    transition('* => *', [
      query(':enter', [
        style({ top: '{{enter}}'})
      ],{ optional: true }),

      group([
        query(':enter', [
          group([
            animate(scrollTiming, 
              style('*')
            ),
            query('@*', animateChild(),{ optional: true } )
          ])
        ],{ optional: true }),

        query(':leave', [
          animate(scrollTiming,
            style({ top: '{{leave}}'})
          )
        ],{ optional: true })
      ])
    ],{ params: scrollParams.scrollUp })
  ])
  */
]
