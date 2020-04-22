import { OperatorFunction, merge } from 'rxjs';
import { filter, pluck, auditTime, timeInterval } from 'rxjs/operators';

export function autocomplete<T>(time: number): OperatorFunction<T, T> {
  
  return source => merge( 
    // Pick the first value immediately whenever 'time' elapsed since last emission
    source.pipe( 
      
      timeInterval(),

      filter( payload => payload.interval >= time ),

      pluck('value')
    ),
    // Audits every 'time' than
    source.pipe( auditTime(time) )
  );
}