import { state, animate, style, transition, keyframes } from '@angular/animations';

export const pulse = [

  transition('* => pulse', [
    style('*'),
    animate('{{timing}} {{delay}} ease-in-out', 
      keyframes([
        style({ transform: 'scale(1)' }),
        style({ transform: 'scale(1.05)' }),
        style({ transform: 'scale(1)' })
      ])
    )], { params: { timing: '500ms', delay: '' }}
  )
];