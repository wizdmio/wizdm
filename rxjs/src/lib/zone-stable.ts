import { MonoTypeOperatorFunction } from 'rxjs';
import type { NgZone } from '@angular/core';
import { tap, take } from 'rxjs/operators';

/** Calls fn every emission right after the zone has become stable */
export function zoneStable<T>(zone: NgZone, fn: () => void): MonoTypeOperatorFunction<T> {

  return tap<T>( () => zone.isStable ? fn() : zone.onStable.pipe( take(1) ).subscribe(fn) );
}
