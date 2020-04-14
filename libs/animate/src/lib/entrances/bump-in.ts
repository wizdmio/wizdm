import { state, animate, style, transition } from '@angular/animations';

export const bumpIn = [

  state('idle-bumpIn', style({ opacity: 0 }) ),

  transition('* => bumpIn', [

    style({ transform: 'scale(0.5)', opacity: 0 }),
    
    animate("{{timing}} {{delay}} cubic-bezier(.8, -0.6, 0.2, 1.5)", 

      style({ transform: 'scale(1)', opacity: 1 }))

  ], { params: { timing: '500ms', delay: '' }} )
];