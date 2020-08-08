import { of, MonoTypeOperatorFunction } from 'rxjs';
import type { NgZone } from '@angular/core';
import { switchMap, map, take } from 'rxjs/operators';

/** Mirrors the source observable making sure every emission takes place while the given zone is stable */
export function onStable<T>(zone: NgZone): MonoTypeOperatorFunction<T> {

  return switchMap( (value: T) => zone.isStable ? of(value) : zone.onStable.pipe( take(1), map(() => value) ) );
}
