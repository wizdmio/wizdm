import { trigger, state, animate, style, transition } from '@angular/animations';

const $timing = '200ms ease-out';

export let $animations = [

  trigger('fadeOut', [
    transition(':leave', 
      animate($timing, style({ opacity: 0 }))
    )
  ])
];
