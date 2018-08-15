import { Injectable } from '@angular/core';
import { AngularFirestore, 
         AngularFirestoreCollection, QueryFn,
         AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

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

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  get sentinelId() {
    return firebase.firestore.FieldPath.documentId();
  }

  geopoint(lat: number, lng: number) {
    return new firebase.firestore.GeoPoint(lat, lng);
  }

  constructor(public afs: AngularFirestore) { }

  col<T>(ref: dbCollection<T>, queryFn?: QueryFn): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: dbDocument<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  doc$<T>(ref: dbDocument<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(
      map(doc => doc.payload.data() as T)
    );
  }

  col$<T>(ref: dbCollection<T>, queryFn?: QueryFn): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(
      map(docs => {
        return docs.map(a => a.payload.doc.data()) as T[]
      })
    );
  }

  /// with Ids
  docWithId$<T>(ref: dbDocument<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(
      map(doc => {
        const data = doc.payload.data();
        const id = doc.payload.id;
        return ( (typeof data !== 'undefined') ? { ...(data as any), id } : undefined );
      })
    );
  }

  colWithIds$<T>(ref: dbCollection<T>, queryFn?: QueryFn): Observable<T[]> {
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

  add<T>(ref: dbCollection<T>, data) {
    const timestamp = this.timestamp;
    return this.col(ref).add({
      ...data,
      updated: timestamp,
      created: timestamp
    }).then( ref => this.afs.doc<T>(ref));
  }

  set<T>(ref: dbDocument<T>, data: any) {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updated: timestamp,
      created: timestamp
    });
  }

  merge<T>(ref: dbDocument<T>, data: any) {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updated: timestamp
    }, { merge: true } );
  }

  update<T>(ref: dbDocument<T>, data: any) {
    return this.doc(ref).update({
      ...data,
      updated: this.timestamp
    });
  }

  delete<T>(ref: dbDocument<T>) {
    return this.doc(ref).delete();
  }

  /// If doc exists update, otherwise set
  upsert<T>(ref: dbDocument<T>, data: any) {
    const doc = this.doc(ref).snapshotChanges().pipe(
      take(1)
    ).toPromise();

    return doc.then(snap => {
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
    })
  }

  /// create a reference between two documents
  connect(host: dbDocument<any>, key: string, doc: dbDocument<any>) {
    return this.doc(host).update({ [key]: this.doc(doc).ref });
  }

  /// returns a documents references mapped to AngularFirestoreDocument
  docWithRefs$<T>(ref: dbDocument<T>) {
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

  inspectDoc(ref: dbDocument<any>): void {
    const tick = new Date().getTime();
    this.doc(ref).snapshotChanges().pipe(
      take(1),
      tap(d => {
        const tock = new Date().getTime() - tick;
        console.log(`Loaded Document in ${tock}ms`, d);
      })
    ).subscribe();
  }

  inspectCol(ref: dbCollection<any>): void {
    const tick = new Date().getTime();
    this.col(ref).snapshotChanges().pipe(
      take(1),
      tap(c => {
        const tock = new Date().getTime() - tick;
        console.log(`Loaded Collection in ${tock}ms`, c);
      })
    ).subscribe();
  }
/*
  atomic() {
    const batch = firebase.firestore().batch()
    /// add your operations here

    const itemDoc = firebase.firestore().doc('items/myCoolItem');
    const userDoc = firebase.firestore().doc('users/userId');

    const currentTime = this.timestamp

    batch.update(itemDoc, { timestamp: currentTime });
    batch.update(userDoc, { timestamp: currentTime });

    /// commit operations
    return batch.commit()
  }
*/
}