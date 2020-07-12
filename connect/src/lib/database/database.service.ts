import { Injectable, InjectionToken, Inject, Optional, NgZone } from '@angular/core';
import { DatabaseCollection, DatabaseGroup, CollectionRef, Query } from './collection';
import { DatabaseApplication, PersistenceSettings } from './database-application';
import { DistributedCounter, CounterShard } from './counter';
import { DatabaseDocument, DocumentRef } from './document'
import { APP, FirebaseApp } from '../connect.module';

export const PERSISTENCE_SETTINGS = new InjectionToken<PersistenceSettings>('wizdm.connect.database.persistence');

@Injectable()
export class DatabaseService extends DatabaseApplication {

  constructor(@Inject(APP) app: FirebaseApp, zone: NgZone, @Optional() @Inject(PERSISTENCE_SETTINGS) persistence: PersistenceSettings) { 
    super(app, zone, persistence); 
  }

  /**
   * Creates and returns a DatabaseDocument object
   * @param path the path to the collection containing the document
   * @param id the id of the document to be retrived
   */
  public document<T>(path: string|DocumentRef<T>): DatabaseDocument<T> {
    return new DatabaseDocument<T>(this, path);
  }

  /**
   * Creates and returns a DatamaseCOllection object
   * @param path the path to the collection
   */
  public collection<T>(path: string|CollectionRef<T>): DatabaseCollection<T> {
    return new DatabaseCollection<T>(this, path);
  }

  /**
   * Creates and returns a DatabaseGroup object
   * @param groupId the groupId to gather the group
   */
  public collectionGroup<T>(groupId: string|Query<T>): DatabaseGroup<T> {
    return new DatabaseGroup<T>(this, groupId);
  }

  /**
   * Creates a new, or retrives and existing, distributed counter
   * @param path the path to the distributed counter location in the database
   * @param shards number of shards to share the counting with
   */
  public counter(path: string|CollectionRef<CounterShard>, shards: number = 3): DistributedCounter {
    return new DistributedCounter(this, path, shards);
  }
}