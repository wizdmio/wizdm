import { trigger, state, animate, style, transition } from '@angular/animations';

// Angular common animations 
//
// timing: '1s' will last 1 second
//         '500ms 1s' will last 0.5 seconds after a delay of 1 second
//

export function fadeIn(timing = '1s') {
  return trigger('fadeIn', [
    state('void', style({opacity: '0'}) ),
    state('*', style({opacity: '1'}) ),
    transition(':enter', animate(timing + ' ease-in-out')),
    ]);
}

export function fadeInUp(timing = '1s') {
  return trigger('fadeInUp', [
    state('void', style({opacity: 0, transform: 'translateY(20px)'}) ),
    state('*', style({opacity: 1, transform: 'translateX(0)'}) ),
    transition(':enter', animate(timing + ' ease-in-out')),
    ]);
}

export function fadeInDown(timing = '1s') {
  return trigger('fadeInDown', [
    state('void', style({opacity: 0, transform: 'translateY(-20px)'}) ),
    state('*', style({opacity: 1, transform: 'translateX(0)'}) ),
    transition(':enter', animate(timing + ' ease-in-out')),
    ]);
}

export function fadeInRight(timing = '1s') {
  return trigger('fadeInRight', [
    state('void', style({opacity: 0, transform: 'translateX(-20px)'}) ),
    state('*', style({opacity: 1, transform: 'translateX(0)'}) ),
    transition(':enter', animate(timing + ' ease-in-out')),
    ]);
}

export function fadeInLeft(timing = '1s') {
  return trigger('fadeInLeft', [
    state('void', style({opacity: 0, transform: 'translateX(20px)'}) ),
    state('*', style({opacity: 1, transform: 'translateX(0)'}) ),
    transition(':enter', animate(timing + ' ease-in-out')),
    ]);
}

export function fadeOut(timing = '1s') {
  return trigger('fadeOut', [
    state('void', style({opacity: '0'}) ),
    state('*', style({opacity: '1'}) ),
    transition(':leave', animate(timing + ' ease-in-out')),
    ]);
}

/*
function slideToRight() {
  return trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%'}) ),
    state('*', style({position:'fixed', width:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(100%)'}))
    ])
  ]);
}

function slideToLeft() {
  return trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%'}) ),
    state('*', style({position:'fixed', width:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);
}

function slideToBottom() {
  return trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%', height:'100%'}) ),
    state('*', style({position:'fixed', width:'100%', height:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateY(-100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(100%)'}))
    ])
  ]);
}

function slideToTop() {
  return trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%', height:'100%'}) ),
    state('*', style({position:'fixed', width:'100%', height:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateY(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
    ])
  ]);
}
*/