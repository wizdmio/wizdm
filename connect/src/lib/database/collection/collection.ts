import { DatabaseApplication } from '../database-application';
import { DatabaseDocument, DocumentData } from '../document';
import { switchMap, expand, scan } from 'rxjs/operators';
import { CollectionRef, QueryFn } from './types';
import { Observable, of, EMPTY } from 'rxjs';
import { query, get } from './operators';
import { DatabaseQuery } from './query';

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
  public add(data: Partial<T>): Promise<DatabaseDocument<T>> {
    const created = this.db.timestamp;
    return this.ref.add({
      ...data as any,
      created
    }).then( ref => this.db.document<T>(ref) );
  }

  /**
   * Wipes the all the documents matching the query
   * @param query a number to limit the batch size or alternatively a query function
   * selecting the documents to wipe. Just make sure to include a limit() to avoid
   * exceeding the maximum writes limit during batch deletion.
   */
  public wipe(query: number|QueryFn<T> = 50): Promise<number> {
    // Builds the query function according to the input value
    const qf: QueryFn<T> = (typeof query === 'number') ? qf => qf.limit(query) : query;
    // Starts by pushing whatever value
    return this.deleteBatch(qf).pipe(
      // Recursively delete the next batches 
      expand(count => count > 0 ? this.deleteBatch(qf) : EMPTY ),
      // Accumulates the total deletion count
      scan((total, count) => total + count, 0)
      // Returns as a promise
    ).toPromise();
  }

  // Detetes documents in a batch
  private deleteBatch(qf: QueryFn<T>): Observable<number> {
    // Makes sure to limit the request up to bachSize documents
    return this.pipe( query(qf), get(), switchMap( snap => {
      // Skips when done
      if(snap.empty) { return of(0); }
      // Delete documents in a batch
      const batch = this.db.batch();
      snap.forEach( doc => batch.delete(doc.ref) );
      // Commits the batch write and returns the snapshot size
      return batch.commit().then( () => snap.size ) ;
    }));
  }
}