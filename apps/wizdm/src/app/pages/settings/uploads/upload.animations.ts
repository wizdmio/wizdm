import { trigger, animate, style, transition } from '@angular/animations';

const $timing = '225ms cubic-bezier(0.4, 0.0, 0.2, 1)';

export const $animations = [

  trigger('expand', [
    transition(':enter', [ style({ height: '0px', minHeight: '0' }), animate($timing) ]),
    transition(':leave', animate($timing, style({ height: '0px', minHeight: '0' }) ) )
  ])
];