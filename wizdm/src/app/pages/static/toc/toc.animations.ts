import { state, trigger, animate, style, transition, group, query, stagger } from '@angular/animations';
const $timing = '500ms cubic-bezier(0.2, 1, 0.2, 1)';

export const $animations = [

  trigger('topic', [

    state('false', style({ visibility: 'hidden', height: 0 })),
    
    transition('false => true', [
      style({ height: 0, overflow: 'hidden' }),
      query('button',
        style({ 
          opacity: '0', 
          visibility: '*',
          transform: 'translateX(-150px)'
        }), { optional: true }
      ),
      group([
        animate($timing, style({ height: '*' })),
        query('button', stagger(50, animate($timing, style('*'))), { optional: true })
      ]),
    ]),

    transition('true => false', [
      style({ overflow: 'hidden' }),
      group([ 
        animate($timing, style({ height: 0 })),
        query('button', animate($timing, 
          style({ 
            opacity: '0', 
            transform: 'translateY(-150px)'
          })
        ), { optional: true })
      ])
    ])
  ])
];