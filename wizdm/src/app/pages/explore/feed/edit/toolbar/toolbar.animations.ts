import { trigger, animate, style, transition } from '@angular/animations';

const $timing = '300ms ease-in-out';//'450ms cubic-bezier(.8, -0.6, 0.2, 1.5)';

export const $animations = [
  trigger('slide', [
    transition(':enter', [
      style({ height: 0 }),
      animate($timing)
    ]),
    transition(':leave', animate($timing, style({ height: 0 })))
  ])
];
