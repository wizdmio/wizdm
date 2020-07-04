import { Pipe, PipeTransform } from '@angular/core';
import { animationFrameScheduler } from 'rxjs';

/** 
 * Utility pipe to delay value changes until the next animation frame. 
 * Use to avoid ExpressionChangedAfterItHasBeenChecked exception while
 * teleporting content from a child component into the parent container
 * whenever the teleported content affects the container's one
 * */
@Pipe({ name: 'onNextAnimationFrame', pure: false })
export class OnNextAnimationFramePipe implements PipeTransform {

  private lastValue = null;
  private newValue = null;

  transform(value: any): any {

    // Skips unecessary changes
    if(value !== this.lastValue && value !== this.newValue) { 

      // Traks the new value to avoid nesting tasks
      this.newValue = value;

      // Schedule a task to update the last value on the next animation frame 
      animationFrameScheduler.schedule(() => this.lastValue = value );
     }
    
    // Always return the last value
    return this.lastValue;
  }
}
