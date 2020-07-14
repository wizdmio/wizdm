import { WriteBatch, DocumentRef, DocumentData } from './types';
import { DatabaseApplication } from '../database-application';

export class DatabaseBatch {

  constructor(readonly db: DatabaseApplication, readonly btc: WriteBatch) { }

  /**
   * Creates / destructively re-writes the document content.
   * Adds the 'created' timestamp
   */
  public set<T extends DocumentData>(ref: DocumentRef<T>, data: T): this {

    const created = this.db.timestamp;
    return this.btc.set(ref, {
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
    return this.btc.set(ref, {
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
    return this.btc.update(ref, {
      ...data as any,
      updated
    }), this;
  }

  /** Deletes the document */
  public delete<T extends DocumentData>(ref: DocumentRef<T>): this {
    return this.btc.delete(ref), this;
  }

  /** Commits the batch for multiple writes */
  public commit(): Promise<void> {
    return this.btc.commit();
  }
}
