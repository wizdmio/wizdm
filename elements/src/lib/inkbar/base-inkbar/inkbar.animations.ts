import { trigger, state, animate, style, transition, keyframes } from '@angular/animations';

const $timing = '1s cubic-bezier(0.2, 1, 0.3, 1)';

export let $animations = [

  trigger('slide', [
    state('*',
      style({
        left: '{{ left }}',
        top: '{{ top }}',
        width: '{{ width }}',
        height: '{{ height }}'  
      }), { params: { left: '*', top: '*', width: 0, height: 0 } }
    ),
    transition('* => *', animate($timing))
  ])
];