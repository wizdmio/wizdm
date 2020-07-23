import { QueryFn, QueryRef, QuerySnapshot, QueryDocumentSnapshot, DocumentChange, DocumentChangeType, WhereFilterOp, OrderByDirection } from './types';
import { tap, map, scan, filter, expand, take, pluck, switchMap, mergeScan, takeWhile } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot, GetOptions, ListenOptions } from '../document/types';
import { Observable, pipe, defer, OperatorFunction, MonoTypeOperatorFunction } from 'rxjs';
import { fromRef, combineDocumentChanges } from './utils';
import { mapSnaphotData } from '../document/utils';
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

export function get<T extends DocumentData>(options?: GetOptions): OperatorFunction<QueryRef<T>, QuerySnapshot<T>> {
  return switchMap( ref => defer( () => ref.get(options) ) );
}

export function docs<T extends DocumentData>(): OperatorFunction<QuerySnapshot<T>, QueryDocumentSnapshot<T>[]> {
  return map( snap => snap.docs );
}

export function snap<T extends DocumentData>(options?: GetOptions): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {
  return pipe( get(options), docs() );
}

export function onSnapshot<T>(zone: NgZone, options?: ListenOptions): OperatorFunction<QueryRef<T>, QuerySnapshot<T>> {
  return switchMap( ref => fromRef<T>(ref, zone, options) );
}

export function docChanges<T extends DocumentData>(options?: ListenOptions, ...changeTypes: DocumentChangeType[]): OperatorFunction<QuerySnapshot<T>, DocumentChange<T>[]> {
  
  return map( snap => {
    
    const changes = snap.docChanges(options);

    console.log('Changes', changes);

    return (!changeTypes || changeTypes.length <= 0) ? changes : changes.filter( change => changeTypes.indexOf(change.type) >= 0 );
  });
}

export function combineChanges<T extends DocumentData>(seed: QueryDocumentSnapshot<T>[] = []): OperatorFunction<DocumentChange<T>[], QueryDocumentSnapshot<T>[]> {

  return scan( (combined, changes) => combineDocumentChanges(combined, changes), seed );
}

export function stream<T extends DocumentData>(zone: NgZone, ...changeTypes: DocumentChangeType[]): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {

  // When no changeTypes are defined...
  if(!changeTypes || changeTypes.length <= 0) {
    //...listens to snapshot changes and returns the resulting query document array
    return pipe( onSnapshot<T>(zone), docs() );
  }

  // ...scans for the requested document changes otherwise
  return pipe( 
    // Listens for document changes
    onSnapshot<T>(zone), docChanges<T>(undefined, ...changeTypes), 
    // Filters out unwanted changed but the first emission to keep consistent with untyped stream call
    filter( (changes, index) => index === 0 || changes.length > 0 ),
    // Combines the latest changes with the previous snapshots
    combineChanges()
  );
}

export function data<T extends DocumentData>(): OperatorFunction<QueryDocumentSnapshot<T>[], T[]> {
  return source => source.pipe( map( docs => docs.map( doc => mapSnaphotData(doc) ) ) );
}

export function page<T extends DocumentData>(pager: Observable<number>, after?: DocumentSnapshot<T>): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {
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
      })), { results: [], cursor: after, done: false }
    ),
    // Completes when done
    takeWhile(internal => !internal.done, true),
    // Plucks the document snapshots
    pluck('results')
  );
}

export function pageReverse<T extends DocumentData>(pager: Observable<number>, before?: DocumentSnapshot<T>): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {
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
      })), { results: [], cursor: before, done: false }
    ),
    // Completes when done
    takeWhile(internal => !internal.done, true),
    // Plucks the document snapshots
    pluck('results')
  );
}

export function fifo<T extends DocumentData>(zone: NgZone, waitForPendingWrites?: boolean): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {

  return source => source.pipe( 

    snap(), map( snaps => ({ cursor: snaps[snaps.length - 1], snaps })),

    expand( ({ cursor, snaps }) => source.pipe(
      
      startAfter( cursor ),
      
      onSnapshot(zone, { includeMetadataChanges: waitForPendingWrites }), 

      filter( snap => snap.size > 0 && !(waitForPendingWrites && snap.metadata.hasPendingWrites) ),
      
      docs(), take(1),

      map( latest => ({ cursor: latest[snaps.length - 1], snaps: snaps.concat(latest) }) )
    )),

    pluck('snaps'),
  );
}

export function stack<T extends DocumentData>(zone: NgZone, waitForPendingWrites?: boolean): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {
  
  return source => source.pipe( 

    snap(), map( snaps => ({ cursor: snaps[0], snaps })),

    expand( ({ cursor, snaps }) => source.pipe(
      
      endBefore( cursor ),

      onSnapshot(zone, { includeMetadataChanges: waitForPendingWrites }), 

      filter( snap => snap.size > 0 && !(waitForPendingWrites && snap.metadata.hasPendingWrites) ),
      
      docs(), take(1),

      map( latest => ({ cursor: latest[0], snaps: latest.concat(snaps) }) )
    )),

    pluck('snaps'),
  );
}
