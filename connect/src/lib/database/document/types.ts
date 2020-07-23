import { Timestamp } from '../database-application';
import { firestore } from 'firebase/app';

export type DocumentSnapshot<T> = firestore.DocumentSnapshot<T>
export type DocumentRef<T> = firestore.DocumentReference<T>;
export type Transaction = firestore.Transaction;
export type WriteBatch = firestore.WriteBatch;
export type GetOptions = firestore.GetOptions;
export type ListenOptions = firestore.SnapshotListenOptions;

/** Common document content to extend from */
export interface DocumentData extends firestore.DocumentData {
  id?      : string;
  created? : Timestamp;
  updated? : Timestamp;
}
