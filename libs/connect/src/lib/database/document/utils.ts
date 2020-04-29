import { DocumentRef, DocumentSnapshot, DocumentData } from './types';
import { Observable, throwError } from 'rxjs';

/** Builds an Observable od DocumentSnapshots from a Document ref */
export function fromRef<T>(ref: DocumentRef<T>): Observable<DocumentSnapshot<T>> {
  // Throw an error when the referencec is missing
  if(!ref) { return throwError(new Error("Missing Reference") ); }
  // Returns an obsevable wrapping the onSnapshot observer
  return new Observable<DocumentSnapshot<T>>( subscriber => ref.onSnapshot(subscriber) );
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