import { state, animate, style, transition, keyframes } from '@angular/animations';

export const tada = [

  transition('* => tada', [
    style('*'),
    animate('{{timing}} {{delay}} ease-in-out', 
      keyframes([
        style({ transform: 'scale3d(1, 1, 1)', offset: 0 }),
        style({ transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)', offset: 0.1 }),
        style({ transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)', offset: 0.2 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)', offset: 0.3 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: 0.4 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)', offset: 0.5 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: 0.6 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)', offset: 0.7 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: 0.8 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)', offset: 0.9 }),
        style({ transform: 'scale3d(1, 1, 1)', offset: 1 }),
      ])
    )], { params: { timing: '1s', delay: ''}}
  )  
];