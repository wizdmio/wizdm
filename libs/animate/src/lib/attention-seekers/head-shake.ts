import { animate, style, transition, keyframes } from '@angular/animations';

export const headShake = [

  transition('* => headShake', [

    style('*'),
    
    animate('{{timing}} {{delay}} ease-in-out', 

      keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-6px) rotateY(-9deg)', offset: 0.065 }),
        style({ transform: 'translateX(5px) rotateY(7deg)', offset: 0.185 }),
        style({ transform: 'translateX(-3px) rotateY(-5deg)', offset: 0.315 }),
        style({ transform: 'translateX(2px) rotateY(3deg)', offset: 0.435 }),
        style({ transform: 'translateX(0)', offset: 0.5 })
      ])

    )], { params: { timing: '1s', delay: ''}}
  )
];