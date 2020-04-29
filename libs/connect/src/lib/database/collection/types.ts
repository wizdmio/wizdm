import { firestore } from 'firebase/app';

export type CollectionRef<T> = firestore.CollectionReference<T>;
export type Query<T> = firestore.Query<T>;
export type QueryFn<T> = (ref: CollectionRef<T> | Query<T>) => Query<T>;
export type QuerySnapshot<T> = firestore.QuerySnapshot<T>;
export type QueryDocumentSnapshot<T> = firestore.QueryDocumentSnapshot<T>;
export type DocumentChange<T> = firestore.DocumentChange<T>;
