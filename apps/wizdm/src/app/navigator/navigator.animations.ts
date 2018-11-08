import { trigger, state, animate, style, transition, query, stagger, animateChild } from '@angular/animations';

const $timing = '200ms ease-out';

export let $animations = [

  trigger('levitate', [
      state('true',  style({ boxShadow: '0 0 6px rgba(0,0,0,0.5)' })),
      state('false', style({ boxShadow: '0 0 0px rgba(0,0,0,0.5)' })),
      transition('true <=> false', animate($timing))
  ])
];