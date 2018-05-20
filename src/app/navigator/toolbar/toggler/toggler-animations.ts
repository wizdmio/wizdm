import { trigger, state, animate, style, transition } from '@angular/animations';

const $timing = '200ms ease-out';

// The following three animation function are meant to be uses all togheter to create a morphing toggler 
// The toggler is made with the typical three lines '≡' when the animations are triggered, the center
// line fades while the up and down lines rotate 45 degrees into an 'x' 
//
export let togglerAnimations = [

    trigger('top', [
        state('true', 
            style({
                transform: 'translateY(10px) rotate(-135deg)',
                width: '100%',
                left: 0
            })
        ),
        state('false', style('*')),
        transition('true <=> false', animate($timing))
    ]),
    trigger('middle', [
        state('true', 
            style({
                transform: 'rotate(135deg)',
                opacity: 0
            })
        ),
        state('false', style('*')),
        transition('true <=> false', animate($timing))
    ]),
    trigger('bottom', [
        state('true', 
            style({
                transform: 'translateY(-10px) rotate(-45deg)',
                width: '100%',
                left: 0
            })
        ),
        state('false', style('*')),
        transition('true <=> false', animate($timing))
    ])
]
