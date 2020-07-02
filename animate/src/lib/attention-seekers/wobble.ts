import { state, animate, style, transition, keyframes } from '@angular/animations';

export const wobble = [

  transition('* => wobble', [
    style('*'),
    animate('{{timing}} {{delay}} ease-in-out', 
      keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-25%) rotate3d(0, 0, 1, -5deg)', offset: 0.15 }),
        style({ transform: 'translateX(20%) rotate3d(0, 0, 1, 3deg)', offset: 0.3 }),
        style({ transform: 'translateX(-15%) rotate3d(0, 0, 1, -3deg)', offset: 0.45 }),
        style({ transform: 'translateX(10%) rotate3d(0, 0, 1, 2deg)', offset: 0.6 }),
        style({ transform: 'translateX(-5%) rotate3d(0, 0, 1, -1deg)', offset: 0.75 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ])
    )], { params: { timing: '1s', delay: '' }}
  )  
];