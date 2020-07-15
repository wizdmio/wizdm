import { OperatorFunction, ObservableInput, ObservedValueOf } from 'rxjs';
import { defer, concat } from 'rxjs';
import { tap } from 'rxjs/operators';

export function append<T, O extends ObservableInput<any>>(observableFactory: (lastValue: T) => O, startValue?: T): OperatorFunction<T, T|ObservedValueOf<O>> {
  
  return source => defer(() => {

    let lastValue = startValue; 

    return concat( 
      
      source.pipe( tap( value => lastValue = value ) ),

      defer( () => observableFactory(lastValue) )
    );
  }); 
}