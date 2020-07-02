import {
  trigger,
  state,
  animate,
  style,
  transition,
  group,
  query,
  animateChild
} from '@angular/animations';

const $timing = '450ms cubic-bezier(.8, -0.6, 0.2, 1.5)';

export const $animations = [
  trigger('slide', [
    transition(':enter', [
      style({
        //transform: 'rotateY(90deg)',
        marginTop: '-150px'
      }),
      animate($timing)
    ]),
    transition(':leave', [
      animate(
        $timing,
        style({
          //transform: 'rotateY(90deg)',
          marginTop: '-150px'
        })
      )
    ])
  ])
];
