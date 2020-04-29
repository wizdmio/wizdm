import { CollectionRef, QueryDocumentSnapshot, QuerySnapshot, QueryFn, Query } from './types';
import { map, tap, scan, switchMap, expand, takeWhile } from 'rxjs/operators';
import { DatabaseApplication, runInZone } from '../database-application';
import { DatabaseDocument, DocumentRef, DocumentData } from '../document';
import { fromRef, mapDocumentChanges, mapSnaphotData } from './utils';
import { Observable, of, from, throwError } from 'rxjs';

/** Collection object in the database, created by the DatabaseService */
export class DatabaseCollection<T extends DocumentData> {

  /** The internal collection reference */
  public ref: CollectionRef<T>;

  constructor(readonly db: DatabaseApplication, ref: string|CollectionRef<T>) {
    this.from(ref);
  }

  /** Applies the given reference to this object */
  public from(ref: string|CollectionRef<T>): this {
    return (this.ref = this.db.col(ref)), this;
  }

  /** Returns the collection object id */
  public get id(): string { return this.ref.id; }

  /** Returns the collection object path relative to the database root */
  public get path(): string { return this.ref.path; }

  /** Generates a unique ID as if to be used with a a new document */
  public uniqueId(): string { return this.ref.doc().id; }

  /**
   * Returns the requested child document
   * @param path the document path within the collection. If no path is specified, 
   * an automatically-generated unique ID will be used for the refurned DatabaseDocument
   */
  public document(path?: string): DatabaseDocument<T> {
   return this.db.document<T>( this.ref.doc(path) );
  }

  /**
   * Adds a new document to the collection
   * @returns a promise of a DatabaseDocument
   */
  public add(data: T): Promise<DatabaseDocument<T>> {
    const timestamp = this.db.timestamp;
    return this.ref.add({
      ...data as any,
      created: timestamp
    }).then( ref => this.db.document<T>(ref) );
  }

  /**
   * Returns a promise of the collection content as an array.
   * @param qf the optional query funciton
   */
  public get(qf?: QueryFn<T>): Promise<T[]> {
    // Assosiates the query to the collection ref, if any
    const ref = !!qf ? qf(this.ref) : this.ref;
    // Gets the document snapshot
    return ref.get().then( snapshot => { 
      // Maps the snapshot in the DocumentData-like content
      return snapshot.docs.map( doc => mapSnaphotData(doc) ); 
    });
  }

  /**
   * Queries the collection content as an array into an observable of DocumentSnapshots.
   * @param qf the optional filtering funciton
   */
  public query(qf?: QueryFn<T>): Observable<QueryDocumentSnapshot<T>[]> {    
    // Associates the query (if any) to the collection ref
    return fromRef(!!qf ? qf(this.ref) : this.ref).pipe( 
      // Maps the snapshot into document changes
      map( snapshot => snapshot.docChanges() ),
      // Combines the latest changes with the previous snapshots
      scan( (combined, changes) => mapDocumentChanges(combined, changes), [] ),
      // Runs the observable within the Angular zone
      runInZone(this.db.zone)
    );
  }

  /**
   * Streams the collection content as an array into an observable.
   * @param qf the optional filtering funciton
   */
  public stream(qf?: QueryFn<T>): Observable<T[]> {
    // Queries for the document snapshots
    return this.query(qf).pipe( 
      // Maps the snapshots into data content
      map( snapshots => {
        return snapshots.map( snapshot => {
          return mapSnaphotData(snapshot);
        }); 
      }) 
    );
  }

  /**
   * Wipes the full collection in batches
   * @param batchSize the number of document to be deleted each batch
   */
  public wipe(batchSize: number = 20): Promise<void> {
    // Starts by pushing whatever value
    return of(batchSize).pipe(
      // Recursively delete the next batches 
      expand(() => this.wipeBatch(batchSize) ),
      takeWhile( val => val >= batchSize )
    ).toPromise().then( () => null );
  }

  // Detetes documents as batched transaction
  private wipeBatch(batchSize: number): Observable<number> {
    // Makes sure to limit the request up to bachSize documents
    return from( this.ref.limit(batchSize).get() ).pipe( switchMap(snapshot => {
      // Delete documents in a batch
      const batch = this.db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      // Commits the batch write and returns the snapshot length
      return batch.commit().then(() => snapshot.size);
    }));
  }
}