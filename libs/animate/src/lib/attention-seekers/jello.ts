import { state, animate, style, transition, keyframes } from '@angular/animations';

export const jello = [

  transition('* => jello', [
    style({ transformOrigin: 'center' }),
    animate('{{timing}} {{delay}} ease-in-out', 
      keyframes([
        style({ transform: 'skewX(0) skewY(0)', offset: 0 }),
        style({ transform: 'skewX(0) skewY(0)', offset: 0.111 }),
        style({ transform: 'skewX(-12.5) skewY(-12.5)', offset: 0.222 }),
        style({ transform: 'skewX(6.25deg) skewY(6.25deg)', offset: 0.333 }),
        style({ transform: 'skewX(-3.125deg) skewY(-3.125deg)', offset: 0.444 }),
        style({ transform: 'skewX(1.5625deg) skewY(1.5625deg)', offset: 0.555 }),
        style({ transform: 'skewX(-0.78125deg) skewY(-0.78125deg)', offset: 0.666 }),
        style({ transform: 'skewX(0.390625deg) skewY(0.390625deg)', offset: 0.777 }),
        style({ transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)', offset: 0.888 }),
        style({ transform: 'skewX(0) skewY(0)', offset: 1 })
      ])
    )], { params: { timing: '1s', delay: '' }}
  )
];