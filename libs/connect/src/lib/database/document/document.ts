import { DocumentRef, DocumentSnapshot, SnapOptions, DocumentData } from './types';
import { DatabaseCollection, CollectionRef } from '../collection';
import { DistributedCounter, CounterShard } from '../counter';
import { DatabaseApplication } from '../database-application';
import { fromRef, mapSnaphotData } from './utils';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/** Document object in the database, created by the DatabaseService */
export class DatabaseDocument<T extends DocumentData> {

   /** The internal document reference */
  public ref: DocumentRef<T>;

  constructor(readonly db: DatabaseApplication, ref?: string|DocumentRef<T>) {
    this.from(ref);
  }

  /** Applies the given reference to this object */
  public from(ref: string|DocumentRef<T>): DocumentRef<T> {
    return this.ref = this.db.doc(ref);
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
  public set(data: T): Promise<void> {

    // Short-circuits the undefined ref
    if(!this.ref) { return Promise.reject(); }

    const timestamp = this.db.timestamp;
    return this.ref.set({
      ...data as any,
      created: timestamp
    } as T);
  }

  /**
   * Updates the document content by merging the new data with the existing one including sub objects.
   * Adds / updates the 'updated' timestamp
   */
  public merge(data: T): Promise<void> {
    
    // Short-circuits the undefined ref
    if(!this.ref) { return Promise.reject(); }

    const timestamp = this.db.timestamp;
    return this.ref.set({
      ...data as any,
      updated: timestamp
    } as T, { merge: true } );
  }

  /**
   * Updates the document content with the new data. Unlike merge, it overwrites sub objects.
   * Adds / updates the 'updated' timestamp
   */
  public update(data: T): Promise<void> {

    // Short-circuits the undefined ref
    if(!this.ref) { return Promise.reject(); }

    const timestamp = this.db.timestamp;
    return this.ref.update({
      ...data as any,
      updated: timestamp
    } as T);
  }

  /** Check for document existance */
  public exists(): Promise<boolean> {
    // Short-circuits the undefined ref
    return !!this.ref ? this.ref.get().then(snap => snap.exists) : Promise.resolve(false);
  }

  /**
   * Updates an existing document or create a new one by using the relevant fuctions, so,
   * timestamps are created and updated accordingly.
   */
  public upsert(data: T): Promise<void> {
    return this.exists().then(exists => {
      return exists ? this.update(data) : this.set(data);
    })
  }

  /** Returns the document snapshot immediately */
  public snap(options?: SnapOptions): Promise<DocumentSnapshot<T>> {
    // Short-circuits the undefined ref
    return !!this.ref ? this.ref.get(options) : Promise.reject();
  }

  /** Returns the document content immediately */
  public get(): Promise<T> {
    return this.snap().then( snapshot => mapSnaphotData(snapshot) );  
  }

  /** Streams the document content with an observable */
  public stream(): Observable<T> {
    // Builds an Observable from the ref
    return fromRef<T>(this.ref, this.db.zone).pipe( 
      // Maps the snapshot to the data content
      map( snapshot => mapSnaphotData(snapshot) )
    );
  }

  /** Deletes the document */
  public delete(): Promise<void> {
    return !!this.ref ? this.ref.delete() : Promise.reject();
  }
}