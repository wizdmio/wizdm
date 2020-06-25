import { CollectionRef, QuerySnapshot, QueryDocumentSnapshot, QueryFn, Query } from './types';
import { fromRef, mapDocumentChanges, mapSnaphotData } from './utils';
import { DatabaseApplication } from '../database-application';
import { DocumentData } from '../document';
import { map, scan } from 'rxjs/operators';
import { Observable } from 'rxjs';

/** Query of Collection(s) object in the database */
export class DatabaseQuery<T extends DocumentData> {

  constructor(readonly db: DatabaseApplication, public ref: CollectionRef<T>|Query<T>) {}

  /**
   * Returns a Promise of the collection content as a snapshot
   * @param qf the optional query funciton
   */
  public snap(qf?: QueryFn<T>): Promise<QuerySnapshot<T>> {
    // Assosiates the query to the collection ref, if any
    const ref = qf ? qf(this.ref) : this.ref;
    // Gets the document snapshot
    return ref ? ref.get() : Promise.reject( new Error("Collection reference null or undefined") );
  }

  /**
   * Returns a Promise of the collection content as an array.
   * @param qf the optional query funciton
   */
  public get(qf?: QueryFn<T>): Promise<T[]> {
    // Gets the document snapshot
    return this.snap(qf).then( snapshot => { 
      // Maps the snapshot in the DocumentData-like content
      return snapshot.docs.map( doc => mapSnaphotData(doc) ); 
    });
  }

  /**
   * Queries the collection content as an array into an observable of DocumentSnapshots.
   * @param qf the optional filtering funciton
   */
  public query(qf?: QueryFn<T>): Observable<QueryDocumentSnapshot<T>[]> {    
    // Associates the query (if any) to the collection ref
    return fromRef<T>(!!qf ? qf(this.ref) : this.ref, this.db.zone).pipe( 
      // Maps the snapshot into document changes
      map( snapshot => snapshot.docChanges() ),
      // Combines the latest changes with the previous snapshots
      scan( (combined, changes) => mapDocumentChanges(combined, changes), [] )
    );
  }

  /**
   * Streams the collection content as an array into an observable.
   * @param qf the optional filtering funciton
   */
  public stream(qf?: QueryFn<T>): Observable<T[]> {
    // Queries for the document snapshots
    return this.query(qf).pipe( 
      // Maps the snapshots into data content
      map( snapshots => {
        return snapshots.map( snapshot => {
          return mapSnaphotData(snapshot);
        }); 
      }) 
    );
  }
}