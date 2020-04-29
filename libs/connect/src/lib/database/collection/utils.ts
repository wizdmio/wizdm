import { CollectionRef, Query, QuerySnapshot, QueryDocumentSnapshot, DocumentChange } from './types';
import { Observable, throwError } from 'rxjs';
import { DocumentData } from '../document';

/** Builds an Observable of QuerySnaphots from a collection (or query) ref*/
export function fromRef<T>(ref: CollectionRef<T>|Query<T>): Observable<QuerySnapshot<T>> {
  // Throw an error when the referencec is missing
  if(!ref) { return throwError(new Error("Missing Reference") ); }
  // Returns an obsevable wrapping the onSnapshot observer
  return new Observable<QuerySnapshot<T>>( subscriber => ref.onSnapshot(subscriber) );
}

/** Helper function to combine DocumentChange(s) requlting from a Query mapping them into QUeryDocumentSnapshots */
export function mapDocumentChanges<T>(combined: QueryDocumentSnapshot<T>[], changes: DocumentChange<T>[]): QueryDocumentSnapshot<T>[] {
  // Loops on changes
  changes && changes.forEach(change => {
    // Combines the change
    combined = mapDocumentChange(combined, change);  
  });
  // Returns the combined array o
  return combined;
}

/** Combines the single DocumentChange */
export function mapDocumentChange<T>(combined: QueryDocumentSnapshot<T>[], change: DocumentChange<T>): QueryDocumentSnapshot<T>[] {
  // Switches on the change type
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
  // Returns the combined array
  return combined;
}

/** Helper function to map a QueryDocumetnSnapshot into its data payload */
export function mapSnaphotData<T extends DocumentData>(snapshot: QueryDocumentSnapshot<T>): T {
  // Skips undefined data or a missing document
  if(!snapshot || !snapshot.exists) { return undefined; }
  // Gets the data first
  const data = snapshot.data();
  // Ensures to add the id to the data payload
  data.id = snapshot.id;
  // Returns the mapped data
  return data;
}