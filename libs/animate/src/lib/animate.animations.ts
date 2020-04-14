import { trigger, state, style } from '@angular/animations';
import { beat, bounce, headShake, heartBeat, pulse, rubberBand, shake, swing, wobble, jello, tada, flip } from './attention-seekers';
import { bumpIn, bounceIn, fadeIn, flipIn, landing, zoomIn } from './entrances';
import { bounceOut, fadeOut, zoomOut } from './exits';

export type wmAnimations = 

  // Attention seekers
  'beat' |
  'bounce' |
  'flip' |
  'headShake' |
  'heartBeat' |
  'jello' |
  'pulse' |
  'rubberBand' |
  'shake' |
  'swing' |
  'tada' |
  'wobble' |

  // Entrances
  'bumpIn' |
  'bounceIn' |
  'bounceInDown' |
  'bounceInLeft' |
  'bounceInUp' |
  'bounceInRight' |
  'fadeIn' |
  'fadeInRight' |
  'fadeInLeft' |
  'fadeInUp' |
  'fadeInDown' |
  'flipInX' |
  'flipInY' |
  'landing' |
  'zoomIn' |
  'zoomInDown' |
  'zoomInLeft' |
  'zoomInUp' |
  'zoomInRight' |
  
  // Exits
  'bounceOut' |
  'bounceOutDown' |
  'bounceOutUp' |
  'bounceOutRight' |
  'bounceOutLeft' |
  'fadeOut' |
  'fadeOutRight' |
  'fadeOutLeft' |
  'fadeOutDown' |
  'fadeOutUp' |
  'zoomOut' | 
  'zoomOutDown' | 
  'zoomOutRight' | 
  'zoomOutUp' | 
  'zoomOutLeft';

export type wmAnimateSpeed = 'slower' |
'slow' |
'normal' |
'fast'|'faster';

export const $animations = [

  trigger('animate', [

    state('idle', style({ opacity: 0 }) ),

    // Attention seekers
    ...beat,
    ...bounce,
    ...flip,
    ...headShake, 
    ...heartBeat,
    ...jello,
    ...pulse,
    ...rubberBand,
    ...shake,
    ...swing,
    ...tada,
    ...wobble,

    // Entrances
    ...bumpIn,
    ...bounceIn,
    ...fadeIn,
    ...flipIn,
    ...landing,
    ...zoomIn,

    // Exits
    ...bounceOut, 
    ...fadeOut,
    ...zoomOut
  ])
];