import { state, animate, style, transition, keyframes } from '@angular/animations';

export const beat = [

  transition('* => beat', [
    style('*'),
    animate('{{timing}} {{delay}} cubic-bezier(.8, -0.6, 0.2, 1.5)', 
      keyframes([
        style({ transform: 'scale(0.8)' }),
        style({ transform: 'scale(1.5)' }),
        style({ transform: 'scale(1)' })
      ])
    )], { params: { timing: '500ms', delay: '' }}
  )
];