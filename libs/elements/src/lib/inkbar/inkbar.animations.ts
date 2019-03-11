import { trigger, state, animate, style, transition } from '@angular/animations';

const $timing = '500ms cubic-bezier(0.2, 1, 0.3, 1)';

export let $animations = [

  trigger('slide', [
    state('*',
      style({
        left: '{{ left }}',
        width: '{{ width }}' 
      }), { params: { left: '*', width: 0 } }
    ),
    transition('* => *', animate($timing))
  ])
]