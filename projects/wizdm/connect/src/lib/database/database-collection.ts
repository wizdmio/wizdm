import { DatabaseService, dbCollectionRef, dbStreamFn } from './database.service';
import { DatabaseDocument, dbCommon } from './database-document';
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, expand, takeWhile } from 'rxjs/operators';

/**
 * Collection object in the database, created by the DatabaseService
 */
export class DatabaseCollection<T extends dbCommon> {

  constructor(readonly db: DatabaseService, public path: string) { }

  /**
   * Helper returing the collection reference for internal use
   */
  public col(sf?: dbStreamFn): dbCollectionRef<T> {
    return this.db.col<T>(this.path, sf);
  }

  /**
   * Check for document existance
   */
  public exists(): Promise<boolean> {
    return this.col().ref.limit(1).get(undefined)
      .then(snap => snap.size > 0);
  }

  /**
   * Returns the requested document
   * @param id the document id
   */
  public document(id: string): DatabaseDocument<T> {
   return this.db.document<T>(this.path, id);
  }

  /**
   * Adds a new document to the collection
   * @returns a promise of a DatabaseDocument
   */
  public add(data: T): Promise<DatabaseDocument<T>> {
    const timestamp = this.db.timestamp;
    return this.col().add({
      ...data as any,
      created: timestamp
    }).then( ref => this.db.document<T>(this.path, ref.id) );
  }

  /**
   * Returns a promise of the collection content as an array
   * @param sf the optional filtering funciton
   */
  public get(sf?: dbStreamFn): Observable<T[]> {
    return this.col(sf).get()
      .pipe( map( snapshot => {
        const docs = snapshot.docs;
        return docs.map( doc => {
          const data = doc.data();
          const id = doc.id;
          return ( (typeof data !== 'undefined') ? { ...data as any, id } : undefined );
        });
      }));
  }

  /**
   * Streams the collection content as an array into an observable
   * @param sf the optional filtering funciton
   */
  public stream(sf?: dbStreamFn): Observable<T[]> {
    return this.col(sf).snapshotChanges()
      .pipe( map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return ( (typeof data !== 'undefined') ? { ...data as any, id } : undefined );
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
    return of(batchSize)
      .pipe(// Recursively delete the next batches 
        expand(() => this.wipeBatch(batchSize) ),
        takeWhile( val => val >= batchSize )
      ).toPromise().then( () => {} );
  }

  // Detetes documents as batched transaction
  private wipeBatch(batchSize: number): Observable<number> {
    // Makes sure to limit the request up to bachSize documents
    return this.col(ref => ref.limit(batchSize)).get()
      .pipe( mergeMap(snapshot => {
        // Delete documents in a batch
        const batch = this.db.batch();
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        // Commits the batch write and returns the snapshot length
        return from( batch.commit().then(() => snapshot.size) );
      }));
  }
}