import { state, animate, style, transition, keyframes } from '@angular/animations';

export const bounceOut = [

  // Ending states
  state('bounceOut', style({ opacity: 0 })),
  state('bounceOutDown', style({ opacity: 0 })),
  state('bounceOutUp', style({ opacity: 0 })),
  state('bounceOutRight', style({ opacity: 0 })),
  state('bounceOutLeft', style({ opacity: 0 })),

  // Transitions
  transition('* => bounceOut', [

    style({ opacity: 1 }),

    animate('{{timing}} {{delay}} ease-out', 

      keyframes([
        style({ transform: 'scale(0.9)', offset: 0.2 }),
        style({ transform: 'scale(1.1)', offset: 0.5 }),
        style({ transform: 'scale(1.1)', offset: 0.55 }),
        style({ opacity: 0, transform: 'scale(0.3)', offset: 1 })
      ])
    )
  ], { params: { timing: '750ms', delay: '' }} ),

  transition('* => bounceOutDown', [

    style({ opacity: 1 }),

    animate('{{timing}} {{delay}} ease-out', 

      keyframes([
        style({ transform: 'translateY(10px)', offset: 0.2 }),
        style({ transform: 'translateY(-20px)', offset: 0.4 }),
        style({ transform: 'translateY(-20px)', offset: 0.45 }),
        style({ opacity: 0, transform: 'translateY(2000px)', offset: 1 })
      ])
    )
  ], { params: { timing: '1s', delay: '' }} ),

  transition('* => bounceOutUp', [

    style({ opacity: 1 }),

    animate('{{timing}} {{delay}} ease-out', 

      keyframes([
        style({ transform: 'translateY(-10px)', offset: 0.2 }),
        style({ transform: 'translateY(20px)', offset: 0.4 }),
        style({ transform: 'translateY(20px)', offset: 0.45 }),
        style({ opacity: 0, transform: 'translateY(-2000px)', offset: 1 })
      ])
    )
  ], { params: { timing: '1s', delay: '' }} ),

  transition('* => bounceOutRight', [

    style({ opacity: 1 }),

    animate('{{timing}} {{delay}} ease-out', 

      keyframes([
        style({ transform: 'translateX(-20px)', offset: 0.2 }),
        style({ opacity: 0, transform: 'translateX(2000px)', offset: 1 })
      ])
    )
  ], { params: { timing: '1s', delay: '' }} ),

  transition('* => bounceOutLeft', [

    style({ opacity: 1 }),

    animate('{{timing}} {{delay}} ease-out', 

      keyframes([
        style({ transform: 'translateX(20px)', offset: 0.2 }),
        style({ opacity: 0, transform: 'translateX(-2000px)', offset: 1 })
      ])
    )
  ], { params: { timing: '1s', delay: '' }} )
];