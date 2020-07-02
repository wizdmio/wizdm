import { tap, share, take } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs';
import { concat } from 'rxjs';

export function tapOnce<T>(next: (x: T) => void, error?: (e: any) => void, complete?: () => void): MonoTypeOperatorFunction<T> {

  return source => {

    const shared = source.pipe( share() );

    return concat( shared.pipe( take(1), tap(next, error, complete) ), shared ); 
  };
}