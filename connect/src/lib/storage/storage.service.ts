import { StorageApplication, StorageRef, UploadMetadata } from './storage-application';
import { Injectable, Inject, NgZone } from '@angular/core';
import { APP, FirebaseApp } from '../connect.module';
import { StorageReference } from './storage-reference';
import { UploadObservable } from './upload-observable';
import { StorageFile, StorageFolder } from './extras';

/** Wraps the Firebase Storage as a service */
@Injectable()
export class StorageService extends StorageApplication {

  constructor(@Inject(APP) app: FirebaseApp, zone: NgZone) {
    super(app, zone);
  }

  /** Returns a reference to the storage object identified by its path */
  public reference(path: string|StorageRef): StorageReference {
    return new StorageReference(this, path);
  }

  /** Returns a reference to the storage object identified by its download URL */
  public fromURL(url: string): StorageReference {
    return new StorageReference(this, this.storage.refFromURL(url));
  }

  /** Shortcut to start an upload task of binary data */
  public upload(path: string, data: Blob|Uint8Array|ArrayBuffer, metadata?: UploadMetadata): UploadObservable { 
    return this.reference(path).put(data, metadata);
  }

  /** Returns a folder object from a reference */
  public folder(ref: string|StorageRef): StorageFolder {
    return new StorageFolder(this, ref);
  }

  /** Returns a file object from a varaiety of references */
  public file(ref: string|StorageRef|StorageReference|UploadObservable): StorageFile {
    return new StorageFile( ref instanceof UploadObservable || ref instanceof StorageReference ? ref : this.reference(ref) );
  }
}