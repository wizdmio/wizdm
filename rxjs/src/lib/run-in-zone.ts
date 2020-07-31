import { Observable, OperatorFunction } from 'rxjs';
import type { NgZone } from '@angular/core';

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