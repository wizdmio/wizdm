import { trigger, state, animate, style, transition, query, stagger, animateChild } from '@angular/animations';

//const $timing = '1.2s cubic-bezier(0.2, 1, 0.3, 1)';
const $timing = '500ms ease-out';
const $slow = '5s linear';

export let $animations = [

  trigger('reveal', [
      transition(':enter', [
          style({ opacity: 0}),
          animate($timing, style('*'))
      ]),
      transition(':leave', 
        animate($timing, 
          style({ opacity: 0})
        )
      ),

      state('true',  style('*')),
      state('false', style({ opacity: 0.2 })),
      transition('true => false', animate($slow)),
      transition('false => true', animate($timing))
  ])
]