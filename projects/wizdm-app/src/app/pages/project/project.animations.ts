import { trigger, state, animate, style, transition, group, query, stagger, animation, useAnimation, animateChild } from '@angular/animations';

const timings = '1.2s cubic-bezier(0.2, 1, 0.3, 1)';

export let $animations = [
/*
  trigger('reveal', [

    // Materializes elements up
    transition(':enter', [ // Triggers on entering the DOM 

      style({ backgroundColor: 'transparent'}),

      group([// Runs the backgroung and links animations in parallel
        animate(timings, style('*')),
        query('@materialize', animateChild())
      ])
    ]),

    // Reverse the animation but moving down all the lilnks together
    transition(':leave', 
      group([

        animate(timings, style({ backgroundColor: 'transparent'})),
        query('a, div',
          animate(timings, 
            style({ 
              opacity: '0', 
              transform: 'translateY(-150px)'
            })
          )
        )
      ])
    ),
  ]),
*/
  trigger('reveal', [

    // Reveals elements up
    transition(':enter', [ // Triggers on entering the DOM 
  
      query('[toc]', // Hides all the elements
        style({ 
          opacity: '0', 
          transform: 'translateY(-150px)'
        }),
      ),
      
    query('[toc]', // Animates the elements sequentially
        stagger(-75,
          animate(timings, 
            style('*')
          )
        )
      )
    ])/*,

    // Dematerializes link up
    transition(':leave', [ 
      query('a, div', // Animates the  links sequentially with 75ms delay 
        stagger(-75,
          animate(timings, 
            style({ 
              opacity: '0', 
              transform: 'translateY(150px)'
            })
          )
        )
      )
    ]),*/
  ])
];