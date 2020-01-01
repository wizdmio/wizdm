import { Component, Input, HostBinding, TemplateRef } from '@angular/core';
import { trigger, animate, style, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'wm-actionbar',
  template: '<ng-container *ngTemplateOutlet="template"></ng-container>',
  animations: [
    trigger('activate', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger('-100ms', 
            animate('250ms ease-out', style('*'))
          )
        ], { optional: true })
      ])
    ])
  ]
})
export class ActionbarComponent {

  @HostBinding('@activate')
  @Input() template: TemplateRef<any>;
}
