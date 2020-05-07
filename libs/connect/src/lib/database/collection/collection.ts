import { switchMap, expand, takeWhile } from 'rxjs/operators';
import { DatabaseDocument, DocumentData } from '../document';
import { DatabaseApplication } from '../database-application';
import { Observable, from, of } from 'rxjs';
import { DatabaseQuery } from './query';
import { CollectionRef } from './types';

/** Collection object in the database, created by the DatabaseService */
export class DatabaseCollection<T extends DocumentData> extends DatabaseQuery<T> {

  public ref: CollectionRef<T>;

  constructor(db: DatabaseApplication, ref?: string|CollectionRef<T>) {
    super(db, db.col(ref) );
  }

  /** Applies the given reference to this object */
  public from(ref: string|CollectionRef<T>): CollectionRef<T> {
    return this.ref = this.db.col(ref);
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