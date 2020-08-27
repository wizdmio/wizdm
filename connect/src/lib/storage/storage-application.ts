import { StorageReference } from './storage-reference';
import { UploadObservable } from './upload-observable';
import { StorageFile, StorageFolder } from './extras';
import { FirebaseApp } from '@wizdm/connect';
import { NgZone } from '@angular/core';
import { storage } from 'firebase/app';

//--
export type FirebaseStorage    = storage.Storage;
export type StorageRef         = storage.Reference;
export type ListOptions        = storage.ListOptions;
export type ListResult         = storage.ListResult;
export type UploadMetadata     = storage.UploadMetadata;
export type SettableMetadata   = storage.SettableMetadata;
export type FullMetadata       = storage.FullMetadata;
export type StringFormat       = storage.StringFormat;
export type UploadTask         = storage.UploadTask;
export type UploadTaskSnapshot = storage.UploadTaskSnapshot;

/** Wraps the Firebase Storage  */
export abstract class StorageApplication {

  readonly storage: FirebaseStorage;

  constructor(app: FirebaseApp, readonly zone: NgZone) {
    // Gets the Storage instance 
    this.storage = zone.runOutsideAngular( () => app.storage() );
  }

  /** Returns a firebase storage reference to the given path */
  public ref(path: string|StorageRef): StorageRef {
    return typeof path === 'string' ? this.storage.ref(path) : path;
  }

  /** Returns a reference to the storage object identified by its path */
  public abstract reference(path: string|StorageRef): StorageReference;

  /** Returns a reference to the storage object identified by its download URL */
  public abstract fromURL(url: string): StorageReference;

  /** Verifies the validity of a given storage url */
  public abstract testURL(url: string): boolean;

  /** Shortcut to start an upload task of binary data */
  public abstract upload(path: string, data: Blob|Uint8Array|ArrayBuffer, metadata?: UploadMetadata): UploadObservable;

  /** Returns a folder object from a reference */
  public abstract folder(ref: string|StorageRef): StorageFolder;

  /** Returns a file object from a varaiety of references */
  public abstract file(ref: string|StorageRef|StorageReference|UploadObservable): StorageFile;
}