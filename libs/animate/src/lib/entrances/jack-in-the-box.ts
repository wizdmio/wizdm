import { state, animate, style, transition, keyframes } from '@angular/animations';

export const jackInTheBox = [

  state('idle-jackInTheBox', style({ opacity: 0 }) ),
  
  transition('* => jackInTheBox', [
    
    style('*'),
    
    animate('{{timing}} {{delay}} ease-in',

      keyframes([
        style({ 
          transform: 'scale(0.1) rotate(30deg)',
          transformOrigin: 'center bottom', 
          opacity: 0,
          offset: 0 
        }),
        style({ 
          transform: 'rotate(-10deg)', 
          opacity: 0.7, 
          offset: 0.5 
        }),
        style({ transform: 'rotate(3deg)', offset: 0.7 }),
        style({ transform: 'scale(1)', opacity: 1, offset: 1 })
      ])

    )], { params: { timing: '1s', delay: '' }}
  )
];

/*@keyframes jackInTheBox {
  from {
    opacity: 0;
    transform: scale(0.1) rotate(30deg);
    transform-origin: center bottom;
  }

  50% {
    transform: rotate(-10deg);
  }

  70% {
    transform: rotate(3deg);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.jackInTheBox {
  animation-name: jackInTheBox;
}*/