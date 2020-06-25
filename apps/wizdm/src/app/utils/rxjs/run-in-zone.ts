import { NgZone } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';

/** Returns an observable mirroring the source while running within the given zone */
export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {

  return source => new Observable( observer => {
    return source.subscribe(
      (value: T) => zone.run(() => observer.next(value)),
      (e: any) => zone.run(() => observer.error(e)),
      () => zone.run(() => observer.complete())
    );
  });
}