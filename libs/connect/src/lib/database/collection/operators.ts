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
  return map( ref => limit ? ref.startAt(args) : ref );
}

export function startAfter<T extends DocumentData>(snapshot: DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>>;
export function startAfter<T extends DocumentData>(...fieldValues: any[]): MonoTypeOperatorFunction<QueryRef<T>>;
export function startAfter<T extends DocumentData>(args: any[]|DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => limit ? ref.startAfter(args) : ref );
}

export function endBefore<T extends DocumentData>(snapshot: DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>>;
export function endBefore<T extends DocumentData>(...fieldValues: any[]): MonoTypeOperatorFunction<QueryRef<T>>;
export function endBefore<T extends DocumentData>(args: any[]|DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => limit ? ref.endBefore(args) : ref );
}

export function endAt<T extends DocumentData>(snapshot: DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>>;
export function endAt<T extends DocumentData>(...fieldValues: any[]): MonoTypeOperatorFunction<QueryRef<T>>;
export function endAt<T extends DocumentData>(args: any[]|DocumentSnapshot<T>): MonoTypeOperatorFunction<QueryRef<T>> {
  return map( ref => limit ? ref.endAt(args) : ref );
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

export function page<T extends DocumentData>(pager: Observable<any>, size: number): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {

  return source => pager.pipe(
    
    mergeScan( internal => source.pipe( 

      limit(size), startAfter(internal.cursor), snap(),
      
      map( (results: QueryDocumentSnapshot<T>[]) => {

        return {

          results: internal.results.concat(results),

          cursor: results[results.length - 1],

          done: results.length < size
        };

      })), { results: [], cursor: null, done: false }
    ),

    takeWhile(internal => !internal.done, true),

    pluck('results')
  );
}

export function pageReverse<T extends DocumentData>(pager: Observable<any>, size: number): OperatorFunction<QueryRef<T>, QueryDocumentSnapshot<T>[]> {

  return source => pager.pipe(
    
    mergeScan( internal => source.pipe( 

      limitToLast(size), endBefore(internal.cursor), snap(),
      
      map( (results: QueryDocumentSnapshot<T>[]) => {

        return {

          results: results.concat(internal.results),

          cursor: results[0],

          done: results.length < size
        };

      })), { results: [], cursor: null, done: false }
    ),

    takeWhile(internal => !internal.done, true),

    pluck('results')
  );
}