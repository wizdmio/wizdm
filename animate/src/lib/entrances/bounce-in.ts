import { state, animate, style, transition, keyframes } from '@angular/animations';

export const bounceIn = [

  state('idle-bounceIn', style({ opacity: 0 }) ),
  state('idle-bounceInDown', style({ opacity: 0 }) ),
  state('idle-bounceInLeft', style({ opacity: 0 }) ),
  state('idle-bounceInUp', style({ opacity: 0 }) ),
  state('idle-bounceInRight', style({ opacity: 0 }) ),

  transition('* => bounceIn', 

      animate('{{timing}} {{delay}} cubic-bezier(0.215, 0.61, 0.355, 1)', 

        keyframes([
          style({ 
            transform: 'scale(0.3)', 
            opacity: 0, 
            offset: 0 
          }),
          style({ 
            transform: 'scale(1.1)', 
            offset: 0.2 
          }),
          style({ 
            transform: 'scale(0.9)', 
            offset: 0.4 
          }),
          style({ 
            transform: 'scale(1.03)', 
            opacity: 1, 
            offset: 0.6 }),
          style({ 
            transform: 'scale(0.97)', 
            offset: 0.8 }),
          style({ 
            transform: 'scale(1)', 
            opacity: 1, 
            offset: 1 })
        ])
        
      ), { params: { timing: '750ms', delay: '' }}
    ),

    transition('* => bounceInDown', 

      animate('{{timing}} {{delay}} cubic-bezier(0.215, 0.61, 0.355, 1)', 

        keyframes([
          style({ opacity: 0, transform: 'translateY(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: 0.6 }),
          style({ transform: 'translateY(-10px)', offset: 0.75 }),
          style({ transform: 'translateY(5px)', offset: 0.9 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
        ])
        
      ), { params: { timing: '1s', delay: '' }}
    ),

    transition('* => bounceInLeft', 

      animate('{{timing}} {{delay}} cubic-bezier(0.215, 0.61, 0.355, 1)', 

        keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(25px)', offset: 0.6 }),
          style({ transform: 'translateX(-10px)', offset: 0.75 }),
          style({ transform: 'translateX(5px)', offset: 0.9 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1 })
        ])
        
      ), { params: { timing: '1s', delay: '' }}
    ),

    transition('* => bounceInUp', 

      animate('{{timing}} {{delay}} cubic-bezier(0.215, 0.61, 0.355, 1)', 

        keyframes([
          style({ opacity: 0, transform: 'translateY(100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(-25px)', offset: 0.6 }),
          style({ transform: 'translateY(10px)', offset: 0.75 }),
          style({ transform: 'translateY(-5px)', offset: 0.9 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
        ])
        
      ), { params: { timing: '1s', delay: '' }}
    ),

    transition('* => bounceInRight', 

      animate('{{timing}} {{delay}} cubic-bezier(0.215, 0.61, 0.355, 1)', 

        keyframes([
          style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-25px)', offset: 0.6 }),
          style({ transform: 'translateX(10px)', offset: 0.75 }),
          style({ transform: 'translateX(-5px)', offset: 0.9 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1 })
        ])
        
      ), { params: { timing: '1s', delay: '' }}
    )
];