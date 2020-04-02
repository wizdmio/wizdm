import { DatabaseApplication, CollectionRef, QueryFn } from './database-application';
import { DatabaseDocument, dbCommon } from './database-document';
import { Observable, of } from 'rxjs';
import { map, mergeMap, expand, takeWhile } from 'rxjs/operators';

/** Collection object in the database, created by the DatabaseService */
export class DatabaseCollection<T extends dbCommon> {

  /** The internal collection reference */
  public ref: CollectionRef;

  constructor(readonly db: DatabaseApplication, ref: string|CollectionRef) {
    this.from(ref);
  }

  /** Applies the given reference to this object */
  public from(ref: string|CollectionRef): this {
    return (this.ref = this.db?.col(ref) || null), this;
  }

  /** Returns the collection object id */
  public get id(): string { return this.ref.id; }

  /** Returns the collection object path relative to the database root */
  public get path(): string { return this.ref.path; }

  /** Generates a unique ID as if to be used with a a new document */
  public uniqueId(): string { return this.ref.doc().id; }

  /** Helper returing the collection reference for internal use */
  public col(qf?: QueryFn) {
    return this.ref && this.db.afs.collection(this.ref, qf);
  }

  /**
   * Returns the requested child document
   * @param path the document path within the collection. If no path is specified, 
   * an automatically-generated unique ID will be used for the refurned DatabaseDocument
   */
  public document<D extends dbCommon = T>(path?: string): DatabaseDocument<D> {
   return this.db.document<D>( path && this.ref.doc(path) );
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
   * Thanks to AngularFire this runs in NgZone triggering change detection.
   * @param qf the optional filtering funciton
   */
  public get(qf?: QueryFn): Promise<T[]> {
    // Assosiates the query to the collection ref, if any
    const ref = !!qf ? qf(this.ref) : this.ref;
    // Gets the document snapshot
    return ref.get().then( snapshot => { 
        // Maps the snapshot in the dbCommon-like content
        const docs = snapshot.docs;
        return docs.map( doc => {
          const data = doc.data();
          const id = doc.id;
          return ( (typeof data !== 'undefined') ? { ...data as any, id } : undefined );
        });
    });
  }

  /**
   * Streams the collection content as an array into an observable.
   * Thanks to AngularFire this runs in NgZone triggering change detection.
   * @param qf the optional filtering funciton
   */
  public stream(qf?: QueryFn): Observable<T[]> {
    // Gets a snapshotChanges observable using AungularFirestoreColleciton
    return this.col(qf).snapshotChanges()
      // Than maps the snapshot to the dbCommon-like content
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
      ).toPromise().then( () => null );
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
        return batch.commit().then(() => snapshot.size);
      }));
  }
}