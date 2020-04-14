import { state, animate, style, transition } from '@angular/animations';

export const fadeOut = [

  // Ending states
  state('fadeOut', style({ opacity: 0 }) ),
  state('fadeOutRight', style({ opacity: 0 }) ),
  state('fadeOutLeft', style({ opacity: 0 }) ),
  state('fadeOutDown', style({ opacity: 0 }) ),
  state('fadeOutUp', style({ opacity: 0 }) ),

  // Transitions
  transition('* => fadeOut', [

    animate('{{timing}} {{delay}} ease-out', style({ opacity: 0 }))

  ], { params: { timing: '1s', delay: '' }} ),

  transition('* => fadeOutRight', [

    animate('{{timing}} {{delay}} ease-out', style({ opacity: 0, transform: 'translateX(20px)' }))

  ], { params: { timing: '1s', delay: '' }} ),

  transition('* => fadeOutLeft', [

    animate('{{timing}} {{delay}} ease-out', style({ opacity: 0, transform: 'translateX(-20px)' }))

  ], { params: { timing: '1s', delay: '' }} ),

  transition('* => fadeOutDown', [

    animate('{{timing}} {{delay}} ease-out', style({ opacity: 0, transform: 'translateY(20px)' }))

  ], { params: { timing: '1s', delay: '' }} ),

  transition('* => fadeOutUp', [

    animate('{{timing}} {{delay}} ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))

  ], { params: { timing: '1s', delay: '' }} )
  
];