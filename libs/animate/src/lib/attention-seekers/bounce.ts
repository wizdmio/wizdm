import { state, animate, style, transition, keyframes } from '@angular/animations';

export const bounce = [

  transition('* => bounce', [
    style({ transformOrigin: 'center bottom' }),
    animate('{{timing}} {{delay}} ease-in-out', 
      keyframes([
        style({ transform: 'translate3d(0, 0, 0)', animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)', offset: 0 }),
        style({ transform: 'translate3d(0, 0, 0)', animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)', offset: 0.2 }),
        style({ transform: 'translate3d(0, -30px, 0)', animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)', offset: 0.4 }),
        style({ transform: 'translate3d(0, -30px, 0)', animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06', offset: 0.43 }),
        style({ transform: 'translate3d(0, 0, 0)', animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)', offset: 0.53 }),
        style({ transform: 'translate3d(0, -15px, 0)', animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)', offset: 0.7 }),
        style({ transform: 'translate3d(0, 0, 0)', animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)', offset: 0.8 }),
        style({ transform: 'translate3d(0, -4px, 0)', offset: 0.9 }),
        style({ transform: 'translate3d(0, 0, 0)', animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)', offset: 1 })
      ])
    )], { params: { timing: '1s', delay: '' }}
  )
];