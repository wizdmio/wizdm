import { default as firebase } from 'firebase/app';

/** Collectio Reference */
export type CollectionRef<T> = firebase.firestore.CollectionReference<T>;

/** Query */
export type Query<T> = firebase.firestore.Query<T>;

/** Query order direction */
export type OrderByDirection = firebase.firestore.OrderByDirection;

/** Query filter operation */
export type WhereFilterOp = firebase.firestore.WhereFilterOp;

/** Query Reference (including either CollectionRef or Query ) */
export type QueryRef<T> = CollectionRef<T> | Query<T>;

/** Query Function */
export type QueryFn<T> = (ref: QueryRef<T>) => Query<T>;

/** Query Snapshot */
export type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;

/** Query Document Snapshot */
export type QueryDocumentSnapshot<T> = firebase.firestore.QueryDocumentSnapshot<T>;

/** Document Change */
export type DocumentChange<T> = firebase.firestore.DocumentChange<T>;

export type DocumentChangeType = firebase.firestore.DocumentChangeType;
