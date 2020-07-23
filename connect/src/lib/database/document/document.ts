import { DocumentRef, DocumentSnapshot, GetOptions, ListenOptions, DocumentData } from './types';
import { DatabaseApplication, FieldPath } from '../database-application';
import { DatabaseCollection, CollectionRef } from '../collection';
import { DistributedCounter, CounterShard } from '../counter';
import { fromRef, mapSnaphotData, refReject } from './utils';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/** Document object in the database, created by the DatabaseService */
export class DatabaseDocument<T extends DocumentData> {

   /** The internal document reference */
  public ref: DocumentRef<T>;

  constructor(readonly db: DatabaseApplication, pathOrRef?: string|DocumentRef<T>) {
    this.ref = db.doc(pathOrRef);
  }

  /** Unwraps a document snapshot assuming its reference and returning the data content */
  public unwrap(snapshot: DocumentSnapshot<T>): T {
    return this.ref = snapshot?.ref, mapSnaphotData(snapshot);
  }

  /** Returns the document object id */
  public get id(): string { return this.ref && this.ref.id; }

  /** Returns the document object path relative to the database root */
  public get path(): string { return this.ref && this.ref.path; }

  /** Returns the parent collection */
  public get parent(): DatabaseCollection<T> {
    return this.ref && this.db.collection<T>( this.ref.parent );
  }

  /** Returns a child collection */
  public collection<C extends DocumentData>(path: string): DatabaseCollection<C> {
    return this.ref && this.db.collection<C>( this.ref.collection(path) as CollectionRef<C> );
  }

  /** Returns a child distributed counter */
  public counter(path: string, shards?: number): DistributedCounter {
    return this.ref && this.db.counter( this.ref.collection(path) as CollectionRef<CounterShard>, shards);
  }
  
  /**
   * Creates / destructively re-writes the document content.
   * Adds the 'created' timestamp
   */
  public set(data: Partial<T>): Promise<void> {

    const created = this.db.timestamp;
    return this.ref ? this.ref.set({
      ...data,
      created
    } as T) : refReject();
  }

  /**
   * Updates the document content by merging the new data with the existing one including sub objects.
   * Adds / updates the 'updated' timestamp
   */
  public merge(data: Partial<T>): Promise<void> {
    
    const updated = this.db.timestamp;
    return this.ref ? this.ref.set({
      ...data,
      updated
    } as T, { merge: true } ) : refReject();
  }

  public mergeFields(data: Partial<T>, ...fields: (string|FieldPath)[]): Promise<void> {
    
    const updated = this.db.timestamp;
    return this.ref ? this.ref.set({
      ...data,
      updated
    } as T, { mergeFields: [...fields, 'updated'] } ) : refReject();
  }

  /**
   * Updates the document content with the new data. Unlike merge, it overwrites sub objects.
   * Adds / updates the 'updated' timestamp
   */
  public update(data: Partial<T>): Promise<void> {

    const updated = this.db.timestamp;
    return this.ref ? this.ref.update({
      ...data,
      updated
    } as T) : refReject();
  }

  /** Check for document existance */
  public exists(): Promise<boolean> {
    // Short-circuits the undefined ref
    return this.ref ? this.ref.get().then(snap => snap.exists) : Promise.resolve(false);
  }

  /**
   * Conditionally updates an existing document or creates a new one if not existing.
   * Uses a transaction to support concurrency
   */
  public upsert(data: Partial<T>): Promise<void> {

    if(!this.ref) { return refReject(); }

    return this.db.transaction( trx => {

      return trx.snap(this.ref).then( ({ exists }) => {

        exists ? trx.update(this.ref, data) : trx.set(this.ref, data);
      });
    });
  }

  /** Returns the document snapshot immediately */
  public snap(options?: GetOptions): Promise<DocumentSnapshot<T>> {
    // Short-circuits the undefined ref
    return this.ref ? this.ref.get(options) : refReject();
  }

  /** Returns the document content immediately */
  public get(options?: GetOptions): Promise<T> {
    return this.snap(options).then( snapshot => mapSnaphotData(snapshot) );  
  }

  /** Returns an observable streaming this document snapshot */
  public asObservable(options?: ListenOptions): Observable<DocumentSnapshot<T>> {
    return fromRef<T>(this.ref, this.db.zone, options);
  }

  /** Streams the document content with an observable */
  public stream(options?: ListenOptions): Observable<T> {
    // Maps the snapshot to the data content
    return this.asObservable(options).pipe( map( snapshot => mapSnaphotData(snapshot) ));
  }

  /** Deletes the document */
  public delete(): Promise<void> {
    return this.ref ? this.ref.delete() : refReject();
  }
}