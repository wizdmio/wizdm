import { trigger, state, animate, style, transition, keyframes, group, query, stagger, animateChild } from '@angular/animations';

const $timing = '500ms cubic-bezier(0.5, 0.5, 0.5, 1.0)';

export let $animations = [

  trigger('blink',[
    transition(':enter', [
      query('path, span', [
        style({
          opacity: 0
        })
      ]), 
      query('path, span', [
        stagger('-150ms', [
          animate($timing,  
            style('*')
          )
        ])
      ])
    ]),
    transition('* => *', [
      query('path', [
        style({
          opacity: 0
        })
      ]), 
      query('path', [
        stagger('-150ms', [
          animate($timing,  
            style('*')
          )
        ])
      ])
    ])
  ])
];
