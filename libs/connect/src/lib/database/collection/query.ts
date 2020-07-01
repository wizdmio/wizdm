import { QueryDocumentSnapshot, QueryFn, QueryRef } from './types';
import { DatabaseApplication } from '../database-application';
import { query, snap, stream, data } from'./operators';
import { DocumentData } from '../document';
import { Observable, of } from 'rxjs';
import { refError } from './utils';

/** Query of Collection(s) object in the database */
export class DatabaseQuery<T extends DocumentData> extends Observable<QueryRef<T>> {

  public get ref(): QueryRef<T> { return this._ref; }

  constructor(readonly db: DatabaseApplication, protected _ref: QueryRef<T>) {
    super( observer => ( _ref ? of(_ref) : refError() ).subscribe(observer) );
  }

  public snap(qf?: QueryFn<T>): Promise<QueryDocumentSnapshot<T>[]> {
    return this.pipe( query(qf), snap() ).toPromise();
  }

  /**
   * Returns the collection content once.
   * @param qf the optional query funciton
   */
  public get(qf?: QueryFn<T>): Promise<T[]> {
    return this.pipe( query(qf), snap(), data() ).toPromise();
  }

  /**
   * Queries the collection content as an array into an observable of snapshots
   * @param qf the optional filtering funciton
   */
  public query(qf?: QueryFn<T>): Observable<QueryDocumentSnapshot<T>[]> {
    return this.pipe( query(qf), stream(this.db.zone) );
  }

  /**
   * Streams the collection content as an array into an observable.
   * @param qf the optional filtering funciton
   */
  public stream(qf?: QueryFn<T>): Observable<T[]> {
    return this.pipe( query(qf), stream(this.db.zone), data() );
  }
}