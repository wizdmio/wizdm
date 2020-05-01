import { Injectable, Inject, NgZone } from '@angular/core';
import { APP, FirebaseApp } from '../connect.module';
import { StorageReference } from './storage-reference';
import { UploadObservable } from './upload-observable';
import { StorageFile } from './storage-file';
import { storage } from 'firebase/app';

//--
export type FirebaseStorage      = storage.Storage;
export type StorageRef         = storage.Reference;
export type ListOptions        = storage.ListOptions;
export type ListResult         = storage.ListResult;
export type UploadMetadata     = storage.UploadMetadata;
export type SettableMetadata   = storage.SettableMetadata;
export type StringFormat       = storage.StringFormat;
export type UploadTask         = storage.UploadTask;
export type UploadTaskSnapshot = storage.UploadTaskSnapshot;

/** Wraps the Firebase Storage as a service */
@Injectable()
export class StorageService {

  readonly storage: FirebaseStorage;

  constructor(@Inject(APP) app: FirebaseApp, private zone: NgZone) {
    // Gets the Storage instance 
    this.storage = app.storage();
  }

  /** Returns a reference to the storage object identified by its path */
  public ref(path: string|StorageRef): StorageReference {
    return new StorageReference( typeof path === 'string' ? this.storage.ref(path) : path, this.zone );
  }

  /** Returns a reference to the storage object identified by its download URL */
  public refFromURL(url: string): StorageReference {
    return new StorageReference(this.storage.refFromURL(url), this.zone);
  }

  /** Returns a file object from a varaiety of references */
  public file(ref: string|StorageRef|StorageReference|UploadObservable): StorageFile {
    return new StorageFile( ref instanceof UploadObservable || ref instanceof StorageReference ? ref : this.ref(ref) );
  }

  /** Shortcut to start an upload task of binary data */
  public upload(path: string, data: Blob|Uint8Array|ArrayBuffer, metadata?: UploadMetadata): UploadObservable { 
    return this.ref(path).put(data, metadata);
  }
}