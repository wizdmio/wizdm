import { trigger, state, animate, style, transition } from '@angular/animations';

const $timing = '200ms ease-out';

export let $animations = [

    trigger('fadeIn', [
        transition(':enter', [
            style({ opacity: 0}),
            animate($timing, style('*'))
        ])
    ])
]