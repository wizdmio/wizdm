import { trigger, animate, style, transition } from '@angular/animations';

let $timing = '350ms ease-in';

export let $itemAnimations = [

  trigger('slidein', [
    transition(':enter', [
      style({ 
        transform: 'translate3d(-20%, 0, 0)',
        opacity: 0
      }),
      animate($timing, style('*'))  
    ])
  ]),

  trigger('slideout', [
    transition(':enter', [
      style({ 
        transform: 'translate3d(20%, 0, 0)',
        opacity: 0
      }),
      animate($timing, style('*'))  
    ])
  ]),

  // Dummy animation to bind the host to in order to prevent other animations to kick in during page rendering
  trigger('halt', [
    transition(':enter', [ /* do nothing */ ])
  ])
];