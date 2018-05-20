import { trigger, state, animate, style, transition } from '@angular/animations';

const timingHide    = '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)';
const timingReveal  = '500ms 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55)';
const timingMorph   = '500ms cubic-bezier(0.7,0,0.3,1)';
const timingSubmit  = '300ms 500ms ease-in';

export let searchAnimations = [

    trigger('search', [
        transition(':enter', [
            style({ 
                transform: 'translateX(300px)', 
                opacity: '0'
            }),
            animate(timingReveal, style('*'))
        ]),
        transition(':leave', 
            animate(timingHide, style({
                transform: 'translateX(300px)', 
                opacity: '0'
            }))
        )
    ]),

    trigger('morphSearch', [
        state('open', style({ 
            top: '0',
            right: '0',
            width: '100%',
            height: '100%',
            borderRadius: '0'
        }) ),
        state('close', style({ 
            top: '*',
            right: '*',
            width: '*',
            height: '*',
            borderRadius: '20px' // IE11 issue. Animation breaks if using '*' for border-radius
        }) ),
        transition('close <=> open', animate(timingMorph))
    ]),

    trigger('morphMagnifier', [
        transition(':leave', 
            animate(timingHide, 
                style({ opacity: '0'})
            )
        ),
        transition(':enter',[
            style({ opacity: '0'}), 
            animate(timingReveal, 
                style({ opacity: '1'}) 
            )
        ])
    ]),

    trigger('morphForm', [
        state('open', style({ 
            height: '160px',
            width: '80%',
            transform: 'translateY(3em)'
        }) ),
        state('close', style('*') ),
        transition('close <=> open', animate(timingMorph))
    ]),

    trigger('morphInput', [
        state('open', style({ 
            fontSize: '*',
            opacity: 1
        }) ),
        state('close', style({ 
            fontSize: '0.8em',
            opacity: '*' 
        }) ),
        transition('close <=> open', animate(timingMorph))
    ]),

    trigger('morphSubmit', [
        state('open', style({
            transform: 'translateY(-50%) scale(1)', 
            opacity: '1'
        }) ),
        state('close', style({ 
            transform: 'translateY(-50%) scale(0.1)',
            opacity: '0',
            display: 'none' 
        }) ),
        transition('close => open', animate(timingSubmit))
    ]),

    trigger('morphClose', [
        transition(':enter', [
            style({ 
                transform: 'scale(0.1)',
                opacity: '0'
            }),
            animate(timingSubmit, style('*'))
        ])
    ])
]
