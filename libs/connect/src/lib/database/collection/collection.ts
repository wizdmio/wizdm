import { DatabaseApplication } from '../database-application';
import { switchMap, expand, takeWhile } from 'rxjs/operators';
import { DatabaseDocument, DocumentData } from '../document';
import { limit, snap } from './operators';
import { CollectionRef } from './types';
import { DatabaseQuery } from './query';
import { Observable } from 'rxjs';

/** Collection object in the database, created by the DatabaseService */
export class DatabaseCollection<T extends DocumentData> extends DatabaseQuery<T> {

  public get ref(): CollectionRef<T>{ return this._ref as CollectionRef<T>; }

  constructor(db: DatabaseApplication, pathOrRef?: string|CollectionRef<T>) {
    // Builds the query observalbe first
    super(db, db.col(pathOrRef)); 
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
    return this.wipeBatch(batchSize).pipe(
      // Recursively delete the next batches 
      expand(() => this.wipeBatch(batchSize) ),
      // Stops when done
      takeWhile( length => length >= batchSize )
    // Returns as a promise
    ).toPromise() as any;
  }

  // Detetes documents as batched transaction
  private wipeBatch(batchSize: number): Observable<number> {
    // Makes sure to limit the request up to bachSize documents
    return this.pipe( limit(batchSize), snap(), switchMap( docs => {
      // Delete documents in a batch
      const batch = this.db.batch();
      docs.forEach( doc => batch.delete(doc.ref) );
      // Commits the batch write and returns the snapshot length
      return batch.commit().then( () => docs.length ) ;
    }));
  }
}