import { Injectable } from '@angular/core';
import { AngularFirestore, 
         AngularFirestoreCollection, QueryFn,
         AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable, from } from 'rxjs';
import { map, tap, take, mergeMap, flatMap, takeWhile } from 'rxjs/operators';
import { PagedCollection, PageConfig } from './database-page.class';

import * as firebase from 'firebase';

export type dbCollection<T> = string | AngularFirestoreCollection<T>;
export type dbDocument<T>   = string | AngularFirestoreDocument<T>;

// Tweak the QueryFn to better support filter chaining like:
/*
targetObservable = combineLatest( filter1, filter2 ).pipe(
  switchMap(([filter1, filter2]) =>
    return cols$<...>( ref => {
      if (filter1) { ref = ref.where('field1', '==', filter1); }
      if (filter2) { ref = ref.where('field2', '==', filter2); }
      return ref;
    })
  )
);*/
export type QueryFn = (ref: firebase.firestore.CollectionReference | firebase.firestore.Query) => firebase.firestore.Query;
export type Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  public get sentinelId() {
    return firebase.firestore.FieldPath.documentId();
  }

  public geopoint(lat: number, lng: number) {
    return new firebase.firestore.GeoPoint(lat, lng);
  }

  constructor(public afs: AngularFirestore) { }

  public col<T>(ref: dbCollection<T>, queryFn?: QueryFn): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  public doc<T>(ref: dbDocument<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  public doc$<T>(ref: dbDocument<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(
      map(doc => doc.payload.data() as T)
    );
  }

  public col$<T>(ref: dbCollection<T>, queryFn?: QueryFn): Observable<T[]> {
    
    return this.col(ref, queryFn).snapshotChanges().pipe(
      map(docs => {
        return docs.map(a => a.payload.doc.data()) as T[]
      })
    );
  }

  /**
   * Retrives a document from the database
   * @param ref path or reference to the document
   * @returns an observable of the document value
   */
  public document$<T>(ref: dbDocument<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(
      map(doc => {
        const data = doc.payload.data();
        const id = doc.payload.id;
        return ( (typeof data !== 'undefined') ? { ...(data as any), id } : undefined );
      })
    );
  }

  /**
   * Retrives a collection of documents
   * @param ref path or reference to the collection
   * @param queryFn optional query function to filter the returned values
   * @returns an observable of document values array
   */
  public collection$<T>(ref: dbCollection<T>, queryFn?: QueryFn): Observable<T[]> {

    return this.col(ref, queryFn).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return ( (typeof data !== 'undefined') ? { ...(data as any), id } : undefined );
        });
      })
    );
  }

  /**
   * Retrives a collection of document snapshots. An internal representarion 
   * suitable for comlpex data management such as pagination
   * @param ref path or reference to the collection
   * @param queryFn optional query function to filter the returned values
   * @returns an observable of document snapshots array
   */
  public snapshots$<T>(ref: dbCollection<T>, queryFn?: QueryFn): Observable<any[]> {
    return this.col(ref, queryFn).snapshotChanges()
      .pipe( map( actions => 
        actions.map(a => a.payload.doc ) 
      ));
  }

  /**
   * Retrives a collection of document paginating the result to support infinite scrolling
   * @param ref path or reference to the collection
   * @param opts optional page configuration
   * @returns a class implementing the paged collection to retrive data in pages
   */
  public pagedCollection$<T>(ref: dbCollection<T>, opts?: PageConfig): PagedCollection<T> {
    return new PagedCollection(this, ref, opts);
  }

  /**
   * Add a document to the specified collection
   * @param ref path or reference to the target collection
   * @param data content
   * @returns the string containing the new document id
   */
  public add<T>(ref: dbCollection<T>, data: any): Promise<string> {
    const timestamp = this.timestamp;
    return this.col(ref).add({
      ...data,
      created: timestamp
    }).then( ref => ref.id );
  }

  /**
   * Sets the document content overriding any previous value
   * @param ref path or reference to the requested document
   * @param data data content
   */
  public set<T>(ref: dbDocument<T>, data: any): Promise<void> {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      created: timestamp
    });
  }

  /**
   * Sets the document content merging data with any previous value
   * @param ref path or reference to the requested document
   * @param data data content
   */
  public merge<T>(ref: dbDocument<T>, data: any): Promise<void> {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updated: timestamp
    }, { merge: true } );
  }

  /**
   * Update the document content combining data with any previous value (nested values will be overridden)
   * @param ref path or reference to the requested document
   * @param data data content
   */
  public update<T>(ref: dbDocument<T>, data: any): Promise<void> {
    return this.doc(ref).update({
      ...data,
      updated: this.timestamp
    });
  }

  /**
   * Deletes a document
   * @param ref path or reference to the requested document
   */
  public delete<T>(ref: dbDocument<T>): Promise<void> {
    return this.doc(ref).delete();
  }

  /**
   * Update the document content when existing or create a new document otherwise 
   * @param ref path or reference to the requested document
   * @param data data content
   */
  public upsert<T>(ref: dbDocument<T>, data: any): Promise<void> {
    const doc = this.doc(ref).snapshotChanges().pipe(
      take(1)
    ).toPromise();

    return doc.then(snap => {
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
    })
  }

  /**
   * Deletes a full collection
   * @param ref path or reference to the target collection
   * @param batchSize optional size of the atomic batch used to speedup deletion
   */
  public deleteCollection<T>(ref: dbCollection<T>, batchSize: number = 5): Promise<void> {

    // Starts by deleting a first batch of documents
    return this.deleteBatch(ref, batchSize)
      .pipe( 

        // While there are still documents to delete
        takeWhile( val => val >= batchSize ),

        // Recurs to delete the next batche otherwise
        flatMap(() => this.deleteBatch(ref, batchSize) )

        // Turns the result into a promise
      ).toPromise().then( () => {} );
  }

  // Detetes documents as batched transaction
  private deleteBatch<T>(ref: dbCollection<T>, batchSize: number): Observable<number> {

    // Makes sure to limit the request up to bachSize documents
    return this.col<T>(ref, ref => ref.limit(batchSize))
      .snapshotChanges().pipe(
        take(1),
        mergeMap(snapshot => {

          // Delete documents in a batch
          const batch = this.afs.firestore.batch();
          snapshot.forEach(doc => {
            batch.delete(doc.payload.doc.ref);
          });

          // Commits the batch write and returns the snapshot length
          return from( batch.commit() )
            .pipe( map(() => snapshot.length) );
        })
      )
  }
}

/*
  /// create a reference between two documents
  public connect(host: dbDocument<any>, key: string, doc: dbDocument<any>): Promise<void> {
    return this.doc(host).update({ [key]: this.doc(doc).ref });
  }

  /// returns a documents references mapped to AngularFirestoreDocument
  public docWithRefs$<T>(ref: dbDocument<T>): Observable<T> {
    return this.doc$(ref).pipe(
      map(doc => {
        for (const k of Object.keys(doc)) {
          if (doc[k] instanceof firebase.firestore.DocumentReference) {
            doc[k] = this.doc(doc[k].path);
          }
        }
        return doc;
      })
    );
  }

  public inspectDoc(ref: dbDocument<any>): void {
    const tick = new Date().getTime();
    this.doc(ref).snapshotChanges().pipe(
      take(1),
      tap(d => {
        const tock = new Date().getTime() - tick;
        console.log(`Loaded Document in ${tock}ms`, d);
      })
    ).subscribe();
  }

  public inspectCol(ref: dbCollection<any>): void {
    const tick = new Date().getTime();
    this.col(ref).snapshotChanges().pipe(
      take(1),
      tap(c => {
        const tock = new Date().getTime() - tick;
        console.log(`Loaded Collection in ${tock}ms`, c);
      })
    ).subscribe();
  }
*/