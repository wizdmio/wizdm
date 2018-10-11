import { trigger, state, animate, style, transition } from '@angular/animations';

const $timing = '200ms ease-out';

export let $animations = [

  trigger('fadeIn', [
      state('true', style('*')),
      state('false',  style({ opacity: 0 })),
      transition('false => true', animate($timing))
  ])
]