import { state, animate, style, transition, keyframes } from '@angular/animations';

export const draft = [

  state('idle-draft', style({ opacity: 0 }) ),
  transition('* => draft', [
    style('*'),
    animate('{{timing}} {{delay}} ease-in', 
      keyframes([
        style({ transform: '', offset: 0 }),
        style({ transform: '', offset: 0.1 }),
        style({ transform: '', offset: 0.2 }),
        style({ transform: '', offset: 0.3 }),
        style({ transform: '', offset: 0.4 }),
        style({ transform: '', offset: 0.5 }),
        style({ transform: '', offset: 0.6 }),
        style({ transform: '', offset: 0.7 }),
        style({ transform: '', offset: 0.8 }),
        style({ transform: '', offset: 0.9 }),
        style({ transform: '', offset: 1 })
      ])
    )], { params: { timing: '1s', delay: '' }}
  )
];