import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DatabaseDocument } from './database-document'
import { DatabaseCollection } from './database-collection';
import { PagedCollection, PageConfig } from './database-paged';
import { DistributedCounter } from './database-counter';
import { firestore } from 'firebase';
//--
export type dbCollectionRef<T> = AngularFirestoreCollection<T>;
export type dbDocumentRef<T> = AngularFirestoreDocument<T>;
export type dbCollection<T> = string | dbCollectionRef<T>;
export type dbDocument<T> = string | dbDocumentRef<T>;
export type dbWriteBatch = firestore.WriteBatch;
export type dbTransaction = firestore.Transaction;
export type dbTimestamp = firestore.Timestamp;
export type dbPath = firestore.FieldPath;
export type dbValue = firestore.FieldValue;
export type dbGeopoint = firestore.GeoPoint;
export type dbStreamRef = firestore.CollectionReference | firestore.Query;
export type dbStreamFn = (ref: dbStreamRef) => firestore.Query;

export interface PageConfigRt extends PageConfig {
  realtime?: boolean;
}

@Injectable()
export class DatabaseService {

  constructor(readonly fire: AngularFirestore) { }

  /**
   * Return a server timestamp palceholder (it'll turn into a timestamp serverside) 
   */
  public get timestamp(): dbValue {
    return firestore.FieldValue.serverTimestamp();
  }

  /**
   * Return an ID sentinel to be used in queries 
   */
  public get sentinelId(): dbPath {
    return firestore.FieldPath.documentId();
  }

  /**
   * Creates a geopoint at the given lat and lng
   */
  public geopoint(lat: number, lng: number): dbGeopoint {
    return new firestore.GeoPoint(lat, lng);
  }

  /**
   * Helper returning a reference to a collection for internal use.
   * @param ref a reference to the collection
   * @param queryFn an opnional angularfire2 query function re-typed into a dbStreamFn
   * @returns an AngularFirestoreCollection re-typed into dbColletionRef
   */
  public col<T>(ref: dbCollection<T>, queryFn?: dbStreamFn): dbCollectionRef<T> {
    return typeof ref === 'string' ? this.fire.collection<T>(ref, queryFn) : ref;
  }

  /**
   * Helper returning a reference to a document for internal use.
   * @param ref a reference to the document
   * @returns an AngularFirestoreDocument re-typed into dbDocumentRef
   */
  public doc<T>(ref: dbDocument<T>): dbDocumentRef<T> {
    return typeof ref === 'string' ? this.fire.doc<T>(ref) : ref;
  }

  /**
   * Returns a firestore.WriteBatch re-typed into a dbWriteBatch
   * to support batch operations
   */
  public batch(): dbWriteBatch {
    return this.fire.firestore.batch();
  }

  /**
   * Runs a firestore.Transaction to support atomic operations
   */
  public transaction<T>( updateFn: (t: dbTransaction) => Promise<T> ): Promise<T> {
    return this.fire.firestore.runTransaction<T>(updateFn);
  }

  /**
   * Creates and returns a DatabaseDocument object
   * @param path the path to the collection containing the document
   * @param id the id of the document to be retrived
   */
  public document<T>(path: string, id: string): DatabaseDocument<T> {
    return new DatabaseDocument<T>(this, path, id);
  }

  /**
   * Creates and returns a DatamaseCOllection object
   * @param path the path to the collection
   */
  public collection<T>(path: string): DatabaseCollection<T> {
    return new DatabaseCollection<T>(this, path);
  }

  /**
   * Creates and returns a collection paginating the stream of documents.
   * @param path the path to the collection
   */
  public pagedCollection<T>(path: string): PagedCollection<T> {
    return new PagedCollection<T>(this, path);
  }

  /**
   * Creates a new, or retrives and existing, distributed counter
   * @param path the path to the distributed counter location in the database
   * @param shards number of shards to share the counting with
   */
  public distributedCounter(path: string, shards: number = 3): DistributedCounter {
    return new DistributedCounter(this, path, shards);
  }
}
