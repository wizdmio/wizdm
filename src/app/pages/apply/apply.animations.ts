import { trigger, animate, style, transition } from '@angular/animations';

let $timing = '1s cubic-bezier(0.5,0.5,0.5,1.0)';

export let $animations = [

  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: '0'}),
      animate($timing, style('*'))  
    ])
  ]),
];