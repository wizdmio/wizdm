import { DocumentRef, DocumentSnapshot, DocumentData, ListenOptions } from './types';
import { Observable, throwError } from 'rxjs';
import { NgZone } from '@angular/core';

export function refReject(): Promise<never> {
  return Promise.reject( new Error('Document reference is null or undefined') );
}

/** Builds an Observable od DocumentSnapshots from a Document ref */
export function fromRef<T>(ref: DocumentRef<T>, zone: NgZone, options?: ListenOptions): Observable<DocumentSnapshot<T>> {
  // Throw an error when the referencec is missing
  if(!ref) { return throwError(new Error("Missing Reference") ); }
  // Returns an obsevable wrapping the onSnapshot observer and running within Angular's zone
  return new Observable<DocumentSnapshot<T>>( subscriber => ref.onSnapshot( options || {},
    // Runs the observable within the Angular's zone
    (value: DocumentSnapshot<T>) => zone.run( () => subscriber.next(value) ),
    // Runs the observable within the Angular's zone
    (error: any) => zone.run( () => subscriber.error(error) ),
    // Runs the observable within the Angular's zone
    () => zone.run( () => subscriber.complete() )
  ));
}

/** Helper function to map a DocumetnSnapshot into its data payload */
export function mapSnaphotData<T extends DocumentData>(snapshot: DocumentSnapshot<T>): T {
// Skips undefined data or a missing document
  if(!snapshot || !snapshot.exists) { return undefined; }
  // Gets the data first
  const data = snapshot.data();
  // Ensures to add the id to the data payload
  data.id = snapshot.id;
  // Returns the mapped data
  return data;
}