import { state, animate, style, transition, keyframes } from '@angular/animations';

export const zoomOut = [

  // Ending states
  state('zoomOut', style({ opacity: 0 })),
  state('zoomOutDown', style({ opacity: 0 })),
  state('zoomOutRight', style({ opacity: 0 })),
  state('zoomOutUp', style({ opacity: 0 })),
  state('zoomOutLeft', style({ opacity: 0 })),

  transition('* => zoomOut', 

    animate('{{timing}} {{delay}} ease-out', 
      keyframes([
        style({ opacity: 1, transform: 'scale(1)' }),
        style({ opacity: 0, transform: 'scale(0.3)' }),
        style({ opacity: 0, transform: 'scale(0.3)' })
      ])
    ), { params: { timing: '1s', delay: '' }}
  ),

  transition('* => zoomOutDown', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          opacity: 0, 
          transform: 'scale(0.475) translateY(-60px)', 
          animationTimingFunction:'cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          offset: 0 
        }),
        style({ 
          opacity: 1, 
          transform: 'scale(0.1) translateY(2000px)', 
          transformOrigin: 'center bottom',
          animationTimingFunction:'ubic-bezier(0.175, 0.885, 0.32, 1)', 
          offset: 0.6
        }),
        style({ opacity: 1, transform: 'scale(1) translateY(0)', offset: 1 })
      ])

    ), { params: { timing: '1s', delay: '' }}
  ),

  transition('* => zoomOutRight', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          opacity: 0, 
          transform: 'scale(0.475) translateX(-42px)', 
          animationTimingFunction:'cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          offset: 0 
        }),
        style({ 
          opacity: 1, 
          transform: 'scale(0.1) translateX(2000px)', 
          transformOrigin: 'center bottom',
          animationTimingFunction:'ubic-bezier(0.175, 0.885, 0.32, 1)', 
          offset: 0.6
        }),
        style({ opacity: 1, transform: 'scale(1) translateX(0)', offset: 1 })
      ])

    ), { params: { timing: '1s', delay: '' }}
  ),

  transition('* => zoomOutUp', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          opacity: 0, 
          transform: 'scale(0.475) translateY(60px)', 
          animationTimingFunction:'cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          offset: 0 
        }),
        style({ 
          opacity: 1, 
          transform: 'scale(0.1) translateY(-2000px)', 
          transformOrigin: 'center bottom',
          animationTimingFunction:'ubic-bezier(0.175, 0.885, 0.32, 1)', 
          offset: 0.6
        }),
        style({ opacity: 1, transform: 'scale(1) translateY(0)', offset: 1 })
      ])

    ), { params: { timing: '1s', delay: '' }}
  ),

  transition('* => zoomOutLeft', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          opacity: 0, 
          transform: 'scale(0.475) translateX(42px)', 
          animationTimingFunction:'cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          offset: 0 
        }),
        style({ 
          opacity: 1, 
          transform: 'scale(0.1) translateX(-2000px)', 
          transformOrigin: 'center bottom',
          animationTimingFunction:'ubic-bezier(0.175, 0.885, 0.32, 1)', 
          offset: 0.6
        }),
        style({ opacity: 1, transform: 'scale(1) translateX(0)', offset: 1 })
      ])

    ), { params: { timing: '1s', delay: '' }}
  )
];