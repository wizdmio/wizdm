import { StorageApplication, StorageRef, SettableMetadata, UploadMetadata, ListResult, ListOptions, StringFormat } from './storage-application';
import { UploadObservable } from './upload-observable';
import { Observable, defer } from 'rxjs';

/** Wraps the irebase Storage Reference to include Observable functionalities */
export class StorageReference {

  /** Firebase Storage Reference */
  public ref: StorageRef; 

  constructor(readonly st: StorageApplication, path?: string|StorageRef) {
    this.from(path);
  }

  /** Applies the given reference to this object */
  public from(path: string|StorageRef): StorageRef {
    return this.ref = this.st.ref(path);
  }

  /** Returns the bucket name */
  public get bucket(): string { return this.ref.bucket; }

  /** Returns the file name */
  public get name(): string { return this.ref.name; }

  /** Returns the file's full path */
  public get fullPath(): string { return this.ref.fullPath; }

   /** Returns a child StorageReference object */
  public root(path: string): StorageReference { 
    return this.st.reference(this.ref.root); 
  }

   /** Returns a child StorageReference object */
  public parent(path: string): StorageReference { 
    return this.st.reference(this.ref.parent); 
  }

  /** Returns a child StorageReference object */
  public child(path: string): StorageReference { 
    return this.st.reference(this.ref.child(path)); 
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
  
  /** Lists the items (files) and prefixes (folders) up to the maximum number optionally expressed in options */
  public list(options?: ListOptions): Observable<ListResult> {
    return defer( () => this.ref.list(options) );
  }

  /** List all the files and folders */
  public listAll(): Observable<ListResult> {
    return defer( () => this.ref.listAll() );
  }

  //-- Wraps uploading functionalities with UploadObservable cold observable

  /** Returns an UploadTask cold observable for binary data. Upload process will start upon subscription. */
  public put(data: Blob|Uint8Array|ArrayBuffer, metadata?: UploadMetadata): UploadObservable {
    return new UploadObservable( () => this.ref.put(data, metadata), this.st.zone );
  }

  /** Returns an UploadObservable cold observable text encoded data. Upload process will start upon subscription. */
  public putString(data: string, format?: StringFormat, metadata?: UploadMetadata): UploadObservable {
    return new UploadObservable( () => this.ref.putString(data, format, metadata), this.st.zone );
  }
} 