import { trigger, state, animate, style, transition } from '@angular/animations';

//const $timing = '1.2s cubic-bezier(0.2, 1, 0.3, 1)';
//const $timing = '200ms ease-out';
const $timing = '1s cubic-bezier(0.5,0.5,0.5,1.0)';

export let $animations = [

  trigger('cover', [
      state('false', style('*')),
      state('true',  style({ height: '250px' })),
      transition('false <=> true', animate($timing))
  ])
]