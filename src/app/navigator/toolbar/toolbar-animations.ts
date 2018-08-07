import { trigger, state, animate, style, transition } from '@angular/animations';

const $timing = '200ms ease-out';

export let toolbarAnimations = [

    trigger('divider', [
        state('true',  style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('true <=> false', animate($timing))
    ]),

    trigger('action', [
        state('true',  style({ height: '32px' })),
        state('false', style({ height: 0 })),
        transition('true <=> false', animate($timing))
    ]),

    trigger('shrink', [
        state('false', style('*')),
        state('true',  style({ height: '48px' })),
        transition('true <=> false', animate($timing))
    ])
]
