import { firestore } from 'firebase/app';

/** Collectio Reference */
export type CollectionRef<T> = firestore.CollectionReference<T>;

/** Query */
export type Query<T> = firestore.Query<T>;

/** Query order direction */
export type OrderByDirection = firestore.OrderByDirection;

/** Query filter operation */
export type WhereFilterOp = firestore.WhereFilterOp;

/** Query Reference (including either CollectionRef or Query ) */
export type QueryRef<T> = CollectionRef<T> | Query<T>;

/** Query Function */
export type QueryFn<T> = (ref: QueryRef<T>) => Query<T>;

/** Query Snapshot */
export type QuerySnapshot<T> = firestore.QuerySnapshot<T>;

/** Query Document Snapshot */
export type QueryDocumentSnapshot<T> = firestore.QueryDocumentSnapshot<T>;

/** Document Change */
export type DocumentChange<T> = firestore.DocumentChange<T>;

export type DocumentChangeType = firestore.DocumentChangeType;
