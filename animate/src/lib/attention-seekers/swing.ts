import { state, animate, style, transition, keyframes } from '@angular/animations';

export const swing = [

  transition('* => swing', [
    style({ transformOrigin: 'top center' }),
    animate('{{timing}} {{delay}} ease-in-out', 
      keyframes([
        style({ transform: 'rotate3d(0, 0, 1, 0deg)', offset: 0 }),
        style({ transform: 'rotate3d(0, 0, 1, 15deg)', offset: 0.2 }),
        style({ transform: 'rotate3d(0, 0, 1, -10deg)', offset: 0.4 }),
        style({ transform: 'rotate3d(0, 0, 1, 5deg)', offset: 0.6 }),
        style({ transform: 'rotate3d(0, 0, 1, -5deg)', offset: 0.8 }),
        style({ transform: 'rotate3d(0, 0, 1, 0deg)', offset: 1 })
      ])
    )], { params: { timing: '1s', delay: '' }}
  )
];