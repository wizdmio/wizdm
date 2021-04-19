import { asyncScheduler, asapScheduler, animationFrameScheduler } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

/** Schedulers */
export type SchedulerType = 'asap'|'async'|'animationFrame';

/** 
 * Utility pipe to delay value changes until the next animation frame. 
 * */
@Pipe({ name: 'schedule', pure: false })
export class SchedulePipe implements PipeTransform {

  private lastValue = null;
  private newValue = null;

  transform(value: any, type: SchedulerType = 'asap', delay?: number): any {

    // Skips unecessary changes
    if(value !== this.lastValue && value !== this.newValue) { 

      // Traks the new value to avoid nesting tasks
      this.newValue = value;

      // Schedule a task to update the last value with the selected scheduler
      switch(type) {

        case 'async':
        asyncScheduler.schedule(() => this.lastValue = value, delay || 0);
        break;

        case 'animationFrame':
        animationFrameScheduler.schedule(() => this.lastValue = value);
        break;

        case 'asap': default:
        asapScheduler.schedule(() => this.lastValue = value);
        break;
      }
     }
    
    // Always return the last value
    return this.lastValue;
  }
}
