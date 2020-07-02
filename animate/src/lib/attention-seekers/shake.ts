import { state, animate, style, transition, keyframes } from '@angular/animations';

export const shake = [

  transition('* => shake', [
    style('*'),
    animate('{{timing}} {{delay}} ease-in-out', 
      keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-10px)', offset: 0.1 }),
        style({ transform: 'translateX(10px)', offset: 0.2 }),
        style({ transform: 'translateX(-10px)', offset: 0.3 }),
        style({ transform: 'translateX(10px)', offset: 0.4 }),
        style({ transform: 'translateX(-10px)', offset: 0.5 }),
        style({ transform: 'translateX(10px)', offset: 0.6 }),
        style({ transform: 'translateX(-10px)', offset: 0.7 }),
        style({ transform: 'translateX(10px)', offset: 0.8 }),
        style({ transform: 'translateX(-10px)', offset: 0.9 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ])
    )], { params: { timing: '1s', delay: '' }}
  )
];