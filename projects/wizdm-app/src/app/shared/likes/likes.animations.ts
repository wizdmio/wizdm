import { trigger, state, animate, style, transition, keyframes, query, stagger, animateChild } from '@angular/animations';

const $timing = '450ms cubic-bezier(.8, -0.6, 0.2, 1.5)';

export let $animations = [

  trigger('beat', [
    transition('* => *', 
      animate($timing, 
        keyframes([
          style({ transform: 'scale(0.8)' }),
          style({ transform: 'scale(1.5)' }),
          style({ transform: 'scale(1)' })
        ])
      )
    )
  ])
  /*,
  trigger('wave', [
    //state('*', style({ transform: 'scale(0)'})),
    transition('* => *', [
    style({ transform: 'scale(0)', opacity: '1'}),
      animate('3s', 
       style({ transform: 'scale(3)', opacity: '0'})
      )]
    )
  ])*/
]