import { Timestamp } from '../database-application';
import { default as firebase } from 'firebase';

export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>
export type DocumentRef<T> = firebase.firestore.DocumentReference<T>;
export type Transaction = firebase.firestore.Transaction;
export type WriteBatch = firebase.firestore.WriteBatch;
export type GetOptions = firebase.firestore.GetOptions;
export type ListenOptions = firebase.firestore.SnapshotListenOptions;

/** Common document content to extend from */
export interface DocumentData extends firebase.firestore.DocumentData {
  id?      : string;
  created? : Timestamp;
  updated? : Timestamp;
}
