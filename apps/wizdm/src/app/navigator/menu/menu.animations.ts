import { trigger, state, animate, style, transition, group, query, stagger } from '@angular/animations';
const $smooth = '1s cubic-bezier(0.2, 1, 0.2, 1)';

export let $animations = [

  trigger('menu', [
    
    state('false', style({ height: 0 })),
    
    state('true', style({ height: '*' })),

    transition('false => true', [
      style({ height: 0 }),
      query('button',
        style({ 
          opacity: '0', 
          transform: 'translateY(-150px)'
        }), { optional: true }
      ),
      group([
        animate($smooth, style({ height: '*' })),
        query('button', stagger(-100, animate($smooth, style('*'))), { optional: true })
      ]),
    ]),

    transition('true => false',
      group([ 
        animate($smooth, style({ height: 0 })),
        query('button', animate($smooth, style({ 
          opacity: '0', 
          transform: 'translateY(-150px)'
        })), { optional: true })
      ])
    )
/*
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
    )*/
  ])
];
