import { state, animate, style, transition, keyframes } from '@angular/animations';

export const zoomIn = [

  // Idle states
  state('idle-zoomIn', style({ opacity: 0 }) ),
  state('idle-zoomInDown', style({ opacity: 0 }) ),
  state('idle-zoomInLeft', style({ opacity: 0 }) ),
  state('idle-zoomInUp', style({ opacity: 0 }) ),
  state('idle-zoomInRight', style({ opacity: 0 }) ),

  transition('* => zoomIn', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ opacity: 0, transform: 'scale(0.3)' }),
        style({ opacity: 1, transform: 'scale(0.65)' }),
        style({ opacity: 1, transform: 'scale(1)' })
      ])

    ), { params: { timing: '1s', delay: '' }}
  ),

  transition('* => zoomInDown', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          opacity: 0, 
          transform: 'scale(0.1) translateY(-1000px)', 
          animationTimingFunction:'cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          offset: 0 
        }),
        style({ 
          opacity: 1, 
          transform: 'scale(0.475) translateY(60px)', 
          animationTimingFunction:'cubic-bezier(0.175, 0.885, 0.32, 1)', 
          offset: 0.6
        }),
        style({ opacity: 1, transform: 'scale(1) translateY(0)', offset: 1 })
      ])

    ), { params: { timing: '1s', delay: '' }}
  ),

  transition('* => zoomInLeft', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          opacity: 0, 
          transform: 'scale(0.1) translateX(-1000px)', 
          animationTimingFunction:'cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          offset: 0 
        }),
        style({ 
          opacity: 1, 
          transform: 'scale(0.475) translateX(60px)', 
          animationTimingFunction:'cubic-bezier(0.175, 0.885, 0.32, 1)', 
          offset: 0.6
        }),
        style({ opacity: 1, transform: 'scale(1) translateX(0)', offset: 1 })
      ])

    ), { params: { timing: '1s', delay: '' }}
  ),

  transition('* => zoomInUp', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          opacity: 0, 
          transform: 'scale(0.1) translateY(1000px)', 
          animationTimingFunction:'cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          offset: 0 
        }),
        style({ 
          opacity: 1, 
          transform: 'scale(0.475) translateY(-60px)', 
          animationTimingFunction:'cubic-bezier(0.175, 0.885, 0.32, 1)', 
          offset: 0.6
        }),
        style({ opacity: 1, transform: 'scale(1) translateY(0)', offset: 1 })
      ])

    ), { params: { timing: '1s', delay: '' }}
  ),

  transition('* => zoomInRight', 

    animate('{{timing}} {{delay}} ease-in', 

      keyframes([
        style({ 
          opacity: 0, 
          transform: 'scale(0.1) translateX(1000px)', 
          animationTimingFunction:'cubic-bezier(0.55, 0.055, 0.675, 0.19)', 
          offset: 0 
        }),
        style({ 
          opacity: 1, 
          transform: 'scale(0.475) translateX(-60px)', 
          animationTimingFunction:'cubic-bezier(0.175, 0.885, 0.32, 1)', 
          offset: 0.6
        }),
        style({ opacity: 1, transform: 'scale(1) translateX(0)', offset: 1 })
      ])

    ), { params: { timing: '1s', delay: '' }}
  )

];