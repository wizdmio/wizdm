import { DatabaseApplication } from '../database-application';
import { DocumentData } from '../document';
import { DatabaseQuery } from './query';
import { Query } from './types';

/** Collection object in the database, created by the DatabaseService */
export class DatabaseGroup<T extends DocumentData> extends DatabaseQuery<T> {

  public get ref(): Query<T> { return this._ref as Query<T>; }

  constructor(db: DatabaseApplication, pathOrRef?: string|Query<T>) {
    
    super(db, db.group(pathOrRef) );
  }
}