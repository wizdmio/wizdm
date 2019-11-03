import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseDocument } from './database-document'
import { DatabaseCollection } from './database-collection';
import { PagedCollection } from './database-paged';
import { DistributedCounter } from './database-counter';
import { firestore } from 'firebase/app';
//--
export type dbCollectionRef = firestore.CollectionReference;
export type dbDocumentRef = firestore.DocumentReference;
export type dbWriteBatch = firestore.WriteBatch;
export type dbTransaction = firestore.Transaction;
export type dbTimestamp = firestore.Timestamp;
export type dbPath = firestore.FieldPath;
export type dbValue = firestore.FieldValue;
export type dbGeopoint = firestore.GeoPoint;
export type dbQuery = firestore.Query;
export type dbQueryFn = (ref: dbCollectionRef | dbQuery) => dbQuery;

export abstract class DatabaseApplication {

  constructor(readonly afs: AngularFirestore) { }

  /** Returns the firestore instance */
  public get firestore() { return this.afs.firestore; }

  /** Return a server timestamp palceholder (it'll turn into a timestamp serverside) */
  public get timestamp(): dbValue {
    return firestore.FieldValue.serverTimestamp();
  }

  /** Return an ID sentinel to be used in queries */
  public get sentinelId(): dbPath {
    return firestore.FieldPath.documentId();
  }

  /** Creates a geopoint at the given lat and lng */
  public geopoint(lat: number, lng: number): dbGeopoint {
    return new firestore.GeoPoint(lat, lng);
  }

  /** Returns a firestore.WriteBatch re-typed into a dbWriteBatch to support batch operations */
  public batch(): dbWriteBatch {
    return this.firestore.batch();
  }

  /** Runs a firestore.Transaction to support atomic operations */
  public transaction<T>( updateFn: (t: dbTransaction) => Promise<T> ): Promise<T> {
    return this.firestore.runTransaction<T>(updateFn);
  }

  public doc(ref: string|dbDocumentRef): dbDocumentRef {
    return typeof ref === 'string' ? this.firestore.doc(ref) : ref;
  }

  public col(ref: string|dbCollectionRef): dbCollectionRef {
    return typeof ref === 'string' ? this.firestore.collection(ref) : ref;
  }

  /** Database Objects Factories */
  public abstract document<T>(path: string|dbDocumentRef): DatabaseDocument<T>;
  public abstract collection<T>(path: string|dbCollectionRef): DatabaseCollection<T>;
  public abstract pagedCollection<T>(path: string|dbCollectionRef): PagedCollection<T>;
  public abstract counter(path: string|dbCollectionRef, shards: number): DistributedCounter;
}