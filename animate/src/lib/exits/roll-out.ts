import { state, animate, style, transition, keyframes } from '@angular/animations';

export const rollOut = [

  state('rollOut', style({ opacity: 0 }) ),

  transition('* => rollOut', [

    style({ 
      transform: 'translateX(0)', 
      opacity: 1 
    }),
    
    animate("{{timing}} {{delay}} cubic-bezier(.8, -0.6, 0.2, 1.5)", 

      style({ transform: 'translateX(100%) rotate3d(0, 0, 1, 120deg)', opacity: 0 }))

  ], { params: { timing: '1s', delay: '' }} )
];