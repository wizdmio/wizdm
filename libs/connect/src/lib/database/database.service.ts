import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseDocument } from './database-document'
import { DatabaseCollection } from './database-collection';
import { PagedCollection } from './database-paged';
import { DistributedCounter } from './database-counter';
import { DatabaseApplication, dbCollectionRef, dbDocumentRef } from './database-application';

@Injectable()
/** Wraps the AngularFirestore service to support several enhancements */
export class DatabaseService extends DatabaseApplication {

  constructor(readonly afs: AngularFirestore) { super(afs); }

  /**
   * Creates and returns a DatabaseDocument object
   * @param path the path to the collection containing the document
   * @param id the id of the document to be retrived
   */
  public document<T>(path: string|dbDocumentRef): DatabaseDocument<T> {
    return new DatabaseDocument<T>(this, this.doc(path) );
  }

  /**
   * Creates and returns a DatamaseCOllection object
   * @param path the path to the collection
   */
  public collection<T>(path: string|dbCollectionRef): DatabaseCollection<T> {
    return new DatabaseCollection<T>(this, this.col(path));
  }

  /**
   * Creates and returns a collection paginating the stream of documents.
   * @param path the path to the collection
   */
  public pagedCollection<T>(path: string|dbCollectionRef): PagedCollection<T> {
    return new PagedCollection<T>(this, this.col(path) );
  }

  /**
   * Creates a new, or retrives and existing, distributed counter
   * @param path the path to the distributed counter location in the database
   * @param shards number of shards to share the counting with
   */
  public counter(path: string|dbCollectionRef, shards: number = 3): DistributedCounter {
    return new DistributedCounter(this, this.col(path), shards);
  }
}