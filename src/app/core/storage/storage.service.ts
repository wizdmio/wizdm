import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { storage } from 'firebase';

export type StorageRef = AngularFireStorageReference;
export type StorageTask = AngularFireUploadTask;
export type StorageTaskSnapshot = storage.UploadTaskSnapshot;
export type UploadMetadata = storage.UploadMetadata;

@Injectable({
  providedIn: 'root'
})
/** 
 * Simple service wrapping angularfire2 AngularFireStorage service
 */
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  public ref(path: string): StorageRef {
    return this.storage.ref(path);
  }

  public upload(path: string, data: any, metadata?: UploadMetadata): StorageTask {
    return this.storage.upload(path, data, metadata);
  }
}
