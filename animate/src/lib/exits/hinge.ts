import { state, animate, style, transition, keyframes } from '@angular/animations';

export const hinge = [

  state('hinge', style({ opacity: 0 }) ),

  transition('* => hinge', [

    style({ transformOrigin: 'top left' }),
    
    animate('{{timing}} {{delay}} ease-in-out', 

      keyframes([
        style({ transform: 'rotate3d(0, 0, 1, 0', offset: 0 }),
        style({ transform: 'rotate3d(0, 0, 1, 80deg)', offset: 0.2 }),
        style({ transform: 'rotate3d(0, 0, 1, 60deg)', offset: 0.4 }),
        style({ transform: 'rotate3d(0, 0, 1, 80deg)', offset: 0.6 }),
        style({ transform: 'rotate3d(0, 0, 1, 60deg)', offset: 0.8 }),
        style({ transform: 'translateY(700px)', offset: 1 })
      ])

    )], { params: { timing: '2s', delay: '' }}
  )
];
