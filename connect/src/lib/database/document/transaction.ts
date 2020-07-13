import { Transaction, DocumentRef, DocumentSnapshot, DocumentData } from './types';
import { DatabaseApplication } from '../database-application';
import { mapSnaphotData } from './utils';

export class DatabaseTransaction {

  constructor(readonly db: DatabaseApplication, readonly trx: Transaction) { }

  /**
   * Creates / destructively re-writes the document content.
   * Adds the 'created' timestamp
   */
  public set<T extends DocumentData>(ref: DocumentRef<T>, data: T): this {

    const created = this.db.timestamp;
    return this.trx.set(ref, {
      ...data as any,
      created
    }), this;
  }

  /**
   * Updates the document content by merging the new data with the existing one including sub objects.
   * Adds / updates the 'updated' timestamp
   */
  public merge<T extends DocumentData>(ref: DocumentRef<T>, data: T): this {
    
    const updated = this.db.timestamp;
    return this.trx.set(ref, {
      ...data as any,
      updated
    }, { merge: true } ), this;
  }

  /**
   * Updates the document content with the new data. Unlike merge, it overwrites sub objects.
   * Adds / updates the 'updated' timestamp
   */
  public update<T extends DocumentData>(ref: DocumentRef<T>, data: T): this {

    const updated = this.db.timestamp;
    return this.trx.update(ref, {
      ...data as any,
      updated
    }), this;
  }

  /** Returns the document snapshot immediately */
  public snap<T extends DocumentData>(ref: DocumentRef<T>): Promise<DocumentSnapshot<T>> {
    return this.trx.get(ref);
  }

  /** Returns the document content immediately */
  public get<T extends DocumentData>(ref: DocumentRef<T>): Promise<T> {
    return this.snap<T>(ref).then( snapshot => mapSnaphotData(snapshot) );  
  }

  /** Deletes the document */
  public delete<T extends DocumentData>(ref: DocumentRef<T>): this {
    return this.trx.delete(ref), this;
  }
}
