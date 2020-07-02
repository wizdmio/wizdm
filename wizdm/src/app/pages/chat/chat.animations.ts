import { trigger, state, animate, style, transition, keyframes, query, stagger } from '@angular/animations';

const $timing = '450ms cubic-bezier(0.8, -0.5, 0.2, 1.5)';

export let $animations = [

  trigger('pop', [
    transition(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 }),
      animate($timing, style('*'))
    ]),
    transition(':leave', 
      animate($timing , 
        style({ transform: 'scale(0.5)', opacity: 0 })
      )
    )
  ])
];