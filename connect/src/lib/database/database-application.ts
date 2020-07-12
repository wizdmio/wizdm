import { DatabaseCollection, DatabaseGroup, CollectionRef, Query } from './collection';
import { DistributedCounter, CounterShard } from './counter';
import { DatabaseDocument, DocumentRef } from './document'
import { FirebaseApp } from '../connect.module';
import { firestore } from 'firebase/app';
import { NgZone } from '@angular/core';

export type PersistenceSettings = firestore.PersistenceSettings;
export type FirebaseFirestore = firestore.Firestore;
export type WriteBatch = firestore.WriteBatch;
export type Transaction = firestore.Transaction;
export type Timestamp = firestore.Timestamp;
export type FieldPath = firestore.FieldPath;
export type FieldValue = firestore.FieldValue;
export type GeoPoint = firestore.GeoPoint;

export abstract class DatabaseApplication {

  readonly firestore: FirebaseFirestore;
  private persisted: boolean = false;

  constructor(app: FirebaseApp, readonly zone: NgZone, persistance?: PersistenceSettings) { 
    // Gets the Firestore instance 
    this.firestore = app.firestore();
    // Enables persistance on request
    if(!!persistance) {
      // Runs outside the angular zon to avoid triggerig change detection
      zone.runOutsideAngular( () => {
        // Tries to enable persistance
        this.firestore.enablePersistence(persistance)
          .then( () => this.persisted = true )
          .catch( () => this.persisted = false);
      });        
    }
  }

  /** Returns an ID sentinel to be used in queries */
  public get sentinelId(): FieldPath {
    return firestore.FieldPath.documentId();
  }

  /** Returns a server timestamp palceholder (it'll turn into a timestamp serverside) */
  public get timestamp(): FieldValue {
    return firestore.FieldValue.serverTimestamp();
  }

  /** Returns a sentinel for use with update to mark the field for deletion */
  public get delete(): FieldValue {
    return firestore.FieldValue.delete();
  }

  /** Returns a special value that can be used with set() or update() telling the server to increment the field's current value */
  public increment(n: number): FieldValue {
    return firestore.FieldValue.increment(n);
  }

  /** Returns a special value that can be used with set() or update() telling the server to add the given elements to an array */
  public arrayUnion<T>(...elements: T[]): FieldValue {
    return firestore.FieldValue.arrayUnion(elements);
  }

  /** Returns a special value that can be used with set() or update() telling the server to remove the given elements from an array */
  public arrayRemove<T>(...elements: T[]): FieldValue {
    return firestore.FieldValue.arrayRemove(elements);
  }

  /** Creates a geopoint at the given lat and lng */
  public geopoint(lat: number, lng: number): GeoPoint {
    return new firestore.GeoPoint(lat, lng);
  }

  /** Returns a firestore.WriteBatch re-typed into a WriteBatch to support batch operations */
  public batch(): WriteBatch {
    return this.firestore.batch();
  }

  /** Runs a firestore.Transaction to support atomic operations */
  public transaction<T>( updateFn: (t: Transaction) => Promise<T> ): Promise<T> {
    return this.firestore.runTransaction<T>(updateFn);
  }

  public doc<T>(ref: string|DocumentRef<T>): DocumentRef<T> {
    return !!ref ? (typeof ref === 'string' ? this.firestore.doc(ref) as DocumentRef<T> : ref) : null;
  }

  public col<T>(ref: string|CollectionRef<T>): CollectionRef<T> {
    return !!ref ? (typeof ref === 'string' ? this.firestore.collection(ref) as CollectionRef<T> : ref) : null;
  }

  public group<T>(ref: string|Query<T>): Query<T> {
    return !!ref ? (typeof ref === 'string' ? this.firestore.collectionGroup(ref) as Query<T> : ref) : null;
  }

  /** Database Objects Factories */
  public abstract document<T>(path: string|DocumentRef<T>): DatabaseDocument<T>;
  public abstract collection<T>(path: string|CollectionRef<T>): DatabaseCollection<T>;
  public abstract collectionGroup<T>(groupId: string|Query<T>): DatabaseGroup<T>;
  public abstract counter(path: string|CollectionRef<CounterShard>, shards: number): DistributedCounter;
}
