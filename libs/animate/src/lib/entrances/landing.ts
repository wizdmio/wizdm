import { state, animate, style, transition, keyframes } from '@angular/animations';

export const landing = [

  state('idle-landing', style({ opacity: 0 }) ),
  transition('* => landing', [
    style({
      transform: 'scale(1.2)',
      opacity: 0
    }), 
    animate('{{timing}} {{delay}} ease', style('*'))
  ], { params: { timing: '2s', delay: '' }})
];