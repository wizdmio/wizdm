import { state, animate, style, transition, keyframes } from '@angular/animations';

export const flipIn = [

  state('idle-flipInX', style({ opacity: 0 }) ),
  state('idle-flipInY', style({ opacity: 0 }) ),

  transition('* => flipInX', [

    style({ backfaceVisibility: 'visible' }),

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', 
          opacity: 0,
          offset: 0 
        }),
        style({ 
          transform: ' perspective(400px) rotate3d(1, 0, 0, -20deg)', 
          opacity: 1,
          offset: 0.4 
        }),
        style({ 
          transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)', 
          offset: 0.6 
        }),
        style({ 
          transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)', 
          offset: 0.8 
        }),
        style({ 
          transform: 'perspective(400px) rotate3d(1, 0, 0, 0)', 
          offset: 1 
        })
      ])
    )], { params: { timing: '1s', delay: '' }}
  ),

  transition('* => flipInY', [

    style({ backfaceVisibility: 'visible' }),

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
          opacity: 0,
          offset: 0 
        }),
        style({ 
          transform: ' perspective(400px) rotate3d(0, 1, 0, -20deg)',
          opacity: 1,
          offset: 0.4 
        }),
        style({ 
          transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)', 
          offset: 0.6 
        }),
        style({ 
          transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)', 
          offset: 0.8 
        }),
        style({ 
          transform: 'perspective(400px) rotate3d(0, 1, 0, 0)', 
          offset: 1 
        })
      ])
    )], { params: { timing: '1s', delay: '' }}
  )
];