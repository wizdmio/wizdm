import { StorageRef, SettableMetadata, UploadMetadata, ListResult, ListOptions, StringFormat } from './storage.service';
import { UploadObservable } from './upload-observable';
import { Observable, defer } from 'rxjs';
import { NgZone } from '@angular/core';

/** Wraps the AngularFireStorageReference including list() and listAll() functionalities recently added to firebase API */
export class StorageReference {

  constructor(public ref: StorageRef, private zone: NgZone) {}

  /** Returns the bucket name */
  public get bucket(): string { return this.ref.bucket; }

  /** Returns the file name */
  public get name(): string { return this.ref.name; }

  /** Returns the file's full path */
  public get fullPath(): string { return this.ref.fullPath; }

   /** Returns a child StorageReference object */
  public root(path: string): StorageReference { 
    return new StorageReference( this.ref.root, this.zone ); 
  }

   /** Returns a child StorageReference object */
  public parent(path: string): StorageReference { 
    return new StorageReference( this.ref.parent, this.zone ); 
  }

  /** Returns a child StorageReference object */
  public child(path: string): StorageReference { 
    return new StorageReference( this.ref.child(path), this.zone ); 
  }

  //-- Reverts back to the original Primise-based storage API

  /** Returns the URL to download the file from */
  public getDownloadURL(): Promise<string> { 
    return this.ref.getDownloadURL();
  }

  /** Returns the file Metadata */
  public getMetadata(): Promise<UploadMetadata>{ 
    return this.ref.getMetadata();
  }
  
  /** Updates the file Metadata */
  public updateMetadata(meta: SettableMetadata): Promise<any> { 
    return this.ref.updateMetadata(meta); 
  }

  /** Deletes the file from the storage */
  public delete(): Promise<void> { 
    return this.ref.delete();
  }

  //-- Extends the functionalities including the latest listing API
  
  /** Lists the items (files) and prefixes (folders) up to the maximum number optionally expressed in options */
  public list(options?: ListOptions): Observable<ListResult> {
    //return this.ref.list(options);
    return defer( () => this.ref.list(options) );
  }

  /** List all the files and folders */
  public listAll(): Observable<ListResult> {
    //return this.ref.listAll();
    return defer( () => this.ref.listAll() );
  }

  //-- Wraps uploading functionalities with UploadTask cold observable

  /** Returns an UploadTask cold observable for binary data. Upload process will start upon subscription. */
  public put(data: Blob|Uint8Array|ArrayBuffer, metadata?: UploadMetadata): UploadObservable {
    return new UploadObservable( () => this.ref.put(data, metadata), this.zone );
  }

  /** Returns an UploadTask cold observable text encoded data. Upload process will start upon subscription. */
  public putString(data: string, format?: StringFormat, metadata?: UploadMetadata): UploadObservable {
    return new UploadObservable( () => this.ref.putString(data, format, metadata), this.zone );
  }
} 