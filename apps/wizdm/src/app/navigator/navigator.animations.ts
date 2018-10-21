import { trigger, state, animate, style, transition, query, stagger, animateChild } from '@angular/animations';

const $timing = '200ms ease-out';

export let $animations = [

  trigger('divider', [
      state('true',  style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('true <=> false', animate($timing))
  ])
];