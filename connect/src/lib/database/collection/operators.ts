import { QueryFn, QueryRef, QueryDocumentSnapshot, WhereFilterOp, OrderByDirection } from './types';
import { Observable, defer, OperatorFunction, MonoTypeOperatorFunction } from 'rxjs';
import { map, scan, pluck, switchMap, mergeScan, takeWhile } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot, GetOptions } from '../document/types';
import { fromRef, mapDocumentChanges, mapSnaphotData } from './utils';
import { FieldPath } from '../database-application';
import { NgZone } from '@angular/core';

export function query<T>(qf: QueryFn<T>): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => qf ? qf(ref) : ref );
}

export function where<T extends DocumentData>(field: string|FieldPath, op: WhereFilterOp, value: any): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => field ? ref.where(field, op, value) : ref );
}

export function orderBy<T extends DocumentData>(field: string|FieldPath, dir?: OrderByDirection): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => field ? ref.orderBy(field, dir) : ref );
}

export function limit<T extends DocumentData>(limit: number): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => limit ? ref.limit(limit) : ref );
}

export function limitToLast<T extends DocumentData>(limit: number): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => limit ? ref.limitToLast(limit) : ref );
}

export function startAt<T extends DocumentData>(snapshot: DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>>;
export function startAt<T extends DocumentData>(...fieldValues: any[]): MonoTypeOperatorFunction<QueryRef<T>>;
export function startAt<T extends DocumentData>(args: any[]|DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => args ? ref.startAt(args) : ref );
}

export function startAfter<T extends DocumentData>(snapshot: DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>>;
export function startAfter<T extends DocumentData>(...fieldValues: any[]): MonoTypeOperatorFunction<QueryRef<T>>;
export function startAfter<T extends DocumentData>(args: any[]|DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => args ? ref.startAfter(args) : ref );
}

export function endBefore<T extends DocumentData>(snapshot: DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>>;
export function endBefore<T extends DocumentData>(...fieldValues: any[]): MonoTypeOperatorFunction<QueryRef<T>>;
export function endBefore<T extends DocumentData>(args: any[]|DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => args ? ref.endBefore(args) : ref );
}

export function endAt<T extends DocumentData>(snapshot: DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>>;
export function endAt<T extends DocumentData>(...fieldValues: any[]): MonoTypeOperatorFunction<QueryRef<T>>;
export function endAt<T extends DocumentData>(args: any[]|DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => args ? ref.endAt(args) : ref );
}

export function snap<T extends DocumentData>(options?: GetOptions): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {
  return source => source.pipe( 
    switchMap( ref => defer( () => ref.get(options) ) ),
    map( snap => snap.docs )
  );
}

export function stream<T extends DocumentData>(zone: NgZone): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {
  return source => source.pipe(

    switchMap( ref => fromRef<T>(ref, zone) ),
    // Maps the snapshot into document changes
    map( snap => snap.docChanges() ),
    // Combines the latest changes with the previous snapshots
    scan( (combined, changes) => mapDocumentChanges(combined, changes), [] )
  );
}

export function data<T extends DocumentData>(): OperatorFunction<QueryDocumentSnapshot<T>[], T[]> {
  return source => source.pipe( map( docs => docs.map( doc => mapSnaphotData(doc) ) ) );
}

export function page<T extends DocumentData>(pager: Observable<number>): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {
  // Trggers loading with the pager observable
  return source => pager.pipe(
    // Accumulates the pages
    mergeScan( (internal, size) => source.pipe( 
      // Loads the next page
      limit(size), startAfter(internal.cursor), snap(),
      // Tracks the result
      map( (results: QueryDocumentSnapshot<T>[]) => {

        return {
          // Concatenates the last page 
          results: internal.results.concat(results),
          // Keeps the last snapshot as a cursor for the next page
          cursor: results[results.length - 1],
          // Checks when done
          done: results.length < size
        };
      // Starts empty
      })), { results: [], cursor: null, done: false }
    ),
    // Completes when done
    takeWhile(internal => !internal.done, true),
    // Plucks the document snapshots
    pluck('results')
  );
}

export function pageReverse<T extends DocumentData>(pager: Observable<number>, from?: DocumentSnapshot<T>): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {
  // Trggers loading with the pager observable
  return source => pager.pipe(
    // Accumulates the pages
    mergeScan( (internal, size) => source.pipe( 
      // Loads the previous page
      limitToLast(size), endBefore(internal.cursor), snap(),
      // Tracks the result
      map( (results: QueryDocumentSnapshot<T>[]) => {

        return {
          // Concatenates the last page 
          results: results.concat(internal.results),
          // Keeps the first snapshot as a cursor for the next page
          cursor: results[0],
          // Checks when done
          done: results.length < size
        };
      // Starts empty
      })), { results: [], cursor: from, done: false }
    ),
    // Completes when done
    takeWhile(internal => !internal.done, true),
    // Plucks the document snapshots
    pluck('results')
  );
}