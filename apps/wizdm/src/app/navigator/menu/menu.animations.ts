import { trigger, animate, style, transition, group, keyframes, query, stagger } from '@angular/animations';
const $smooth = '1s cubic-bezier(0.2, 1, 0.2, 1)';

export let $animations = [

  trigger('menu', [

    transition(':enter', [
      style({ height: 0 }),
      query('a',
        style({ 
          opacity: '0', 
          transform: 'translateY(-150px)'
        }),
      ),
      group([
        animate($smooth, style({ height: '*' })),
        query('a', stagger(-100, animate($smooth, style('*'))))
      ]),
    ]),

    transition(':leave',
      group([ 
        animate($smooth, style({ height: 0 })),
        query('a', animate($smooth, style({ 
          opacity: '0', 
          transform: 'translateY(-150px)'
        })))
      ])
    ),
  ])
];
