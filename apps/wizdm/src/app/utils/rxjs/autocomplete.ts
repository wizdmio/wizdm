import { filter, pluck, skip, auditTime, timeInterval } from 'rxjs/operators';
import { MonoTypeOperatorFunction, merge } from 'rxjs';

export function autocomplete<T>(time: number): MonoTypeOperatorFunction<T> {
  
  return source => merge( 
    // Pick the first value immediately whenever 'time' elapsed since last emission
    source.pipe( 
      
      timeInterval(),

      filter( payload => payload.interval === 0 || payload.interval >= time ), 

      pluck('value')
    ),
    // Audits every 'time' than
    source.pipe( auditTime(time), skip(1) ) 
  );
}