import { DatabaseApplication } from '../database-application';
import { DocumentData } from '../document';
import { DatabaseQuery } from './query';
import { Query } from './types';

/** Collection object in the database, created by the DatabaseService */
export class DatabaseGroup<T extends DocumentData> extends DatabaseQuery<T> {

  public ref: Query<T>;

  constructor(db: DatabaseApplication, ref?: string|Query<T>) {
    super(db, db.group(ref) );
  }

  /** Applies the given reference to this object */
  public from(ref: string|Query<T>): Query<T> {
    return this.ref = this.db.group(ref);
  }
}