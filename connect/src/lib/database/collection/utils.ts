import { CollectionRef, Query, QuerySnapshot, QueryDocumentSnapshot, DocumentChange } from './types';
import { ListenOptions } from '../document/types';
import { Observable, throwError } from 'rxjs';
import { NgZone } from '@angular/core';

export function refError(): Observable<never> {
  return throwError(new Error("Collection or query reference null or undefined") );
}

/** Builds an Observable of QuerySnaphots from a collection (or query) ref*/
export function fromRef<T>(ref: CollectionRef<T>|Query<T>, zone: NgZone, options?: ListenOptions): Observable<QuerySnapshot<T>> {
  // Throw an error when the referencec is missing
  if(!ref) { return throwError(new Error("Missing Reference") ); }
  // Returns an obsevable wrapping the onSnapshot observer
  return new Observable<QuerySnapshot<T>>( subscriber => ref.onSnapshot(options || {},
    // Runs the observable within the Angular's zone
    (value: QuerySnapshot<T>) => zone.run( () => subscriber.next(value) ),
    // Runs the observable within the Angular's zone
    (error: any) => zone.run( () => subscriber.error(error) ),
    // Runs the observable within the Angular's zone
    () => zone.run( () => subscriber.complete() )
  ));
}

/** Helper function to combine DocumentChange(s) requlting from a Query mapping them into QUeryDocumentSnapshots */
export function combineDocumentChanges<T>(combined: QueryDocumentSnapshot<T>[], changes: DocumentChange<T>[]): QueryDocumentSnapshot<T>[] {
  
  // Loops on changes
  changes && changes.forEach(change => {
    
    // Combine the single document change
    switch(change.type) {

      case 'added':
      // Skips the addition that actually results in being the same document
      if(combined[change.newIndex] && combined[change.newIndex].ref.isEqual(change.doc.ref)) {
        return combined;  
      } 
      // Adds the snapshot otherwise
      combined.splice(change.newIndex, 0, change.doc);
      break;

      case 'modified':
      // Applies the modification only when the document is actually the same 
      if(combined[change.oldIndex] == null || combined[change.oldIndex].ref.isEqual(change.doc.ref)) {
        // When an item changes position we first remove it and then add it's new position
        if(change.oldIndex !== change.newIndex) {
          combined.splice(change.oldIndex, 1);
          combined.splice(change.newIndex, 0, change.doc);
        } else {
          // Adds the missing item otherwise
          combined.splice(change.newIndex, 1, change.doc);
        }
      }
      break;

      case 'removed':
      // Removes the item only when the document is actually the same
      if(combined[change.oldIndex] && combined[change.oldIndex].ref.isEqual(change.doc.ref)) {
        combined.splice(change.oldIndex, 1);
      }
      break;
    }

  });
  // Returns the combined array o
  return combined;
}
