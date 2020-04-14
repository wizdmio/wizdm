import { animate, style, transition, keyframes } from '@angular/animations';

export const rubberBand = [

  transition('* => rubberBand', [

    style('*'),

    animate('{{timing}} {{delay}} ease-in-out', 

      keyframes([
        style({ transform: 'scale3d(1, 1, 1)', offset: 0 }),
        style({ transform: 'scale3d(1.25, 0.75, 1)', offset: 0.3 }),
        style({ transform: 'scale3d(0.75, 1.25, 1)', offset: 0.4 }),
        style({ transform: 'scale3d(1.15, 0.85, 1)', offset: 0.5 }),
        style({ transform: 'scale3d(0.95, 1.05, 1)', offset: 0.65 }),
        style({ transform: 'scale3d(1.05, 0.95, 1)', offset: 0.75 }),
        style({ transform: 'scale3d(1, 1, 1)', offset: 1 }),
      ])
      
    )], { params: { timing: '1s', delay: ''}}
  )
];