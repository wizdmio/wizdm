import { Injectable } from '@angular/core';
import { wmFile } from '../interfaces';
import { dbDocument, dbCollection, DatabaseService, QueryFn } from '../database/database.service';
import { StorageService } from '../storage/storage.service';
import { Observable, merge } from 'rxjs';
import { switchMap, map, tap, filter, take } from 'rxjs/operators';

export type filePath = dbCollection<wmFile>;
export type fileRef = dbDocument<wmFile>;

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private database : DatabaseService,
              private storage  : StorageService) { }

  public queryUploads(path: filePath, queryFn?: QueryFn): Observable<wmFile[]> {
    return this.database.collection$<wmFile>(path, queryFn);
  }

  public queryFile(ref: fileRef): Observable<wmFile> {
    return this.database.document$<wmFile>(ref);
  }

  /**
   *  Searches for the user file coming with the specified url
   * @param url the url of the file to be searched for
   */
  public queryFileByUrl(path: filePath, url: string): Observable<wmFile> {
    return this.queryUploads(path, ref => ref.where('url', '==', url) )
      .pipe( map( files => files[0] ) )
  }

  public add(path: filePath, data: wmFile): Promise<string> {
    return this.database.add<wmFile>(path, data);
  }

  private unique(name: string): string {
    return `${new Date().getTime()}_${name}`;
  }

  /**
   * Uploads a file into the user's upload area
   * @param file the file object to be uploaded and tracked into the user's uploads area
   * @returns the StorageTaskSnapshot observable to track the process
   */
  public uploadFile(path: filePath, folder: string, file: File): Observable<wmFile> {

    // Computes the storage path
    const storePath = `${folder}/${this.unique(file.name)}`;

    // Creates the upload task
    let task = this.storage.upload(storePath, file);

    // Merges two snapshotChanges observables
    return merge(

      // During the transfer, maps the snapshot to a wmFile tracking the progress in xfer
      // with a simple map, this allow for minimized latency and better progress preview
      task.snapshotChanges().pipe( 
        map( snap => { 
          return { 
            name: file.name,
            fullName: snap.ref.name,
            path: storePath,
            size: snap.totalBytes,
            xfer: snap.bytesTransferred
          };
       })
      ),

      // At completion, gets the download url, saves the file info into user's uploads area...
      task.snapshotChanges().pipe( 
        filter( snap => snap.bytesTransferred === snap.totalBytes ),
        switchMap( snap => {

          // Compile the file content
          const result: wmFile = {
            name: file.name,
            fullName: snap.ref.name,
            path: storePath,
            size: snap.totalBytes,
          };
          
          // Gets the download url
          return snap.ref.getDownloadURL()
            // Saves the uploaded file information into the user uploads area
            .then( url => 
              this.add(path, { ...result, url })
                // Returns a copy of the saved data including the id
                .then( id => { return { ...result, url, id}; })
            );
        }),

        // This implementation do not reload the data from the database
        // to improve performances relying on the returned copy with id instead
        // switchMap( id => this.queryUserFile(id) ),

        // Makes sure it completes
        take(1)
      )
    );
  }

  /**
   * Simplified version of uploadUserFile() executing the upload once
   * @param file file object to be uploaded
   * @returns a promise resolving with the download url
   */
  public uploadFileOnce(path: filePath, folder: string, file: File): Promise<wmFile> {
    return this.uploadFile(path, folder, file).toPromise();
  }

  /**
   * Deletes a user uploaded file clearing up both the storage and the user's uploads area
   */
  public deleteFile(file: fileRef): Promise<void> {
    
    let ref = this.database.doc(file);
    return this.database.doc$<wmFile>(ref)
      .pipe( 
        take(1),
        switchMap( file => this.storage.ref(file.path).delete() ),
        tap( () => ref.delete() )
      ).toPromise();
  }

  public deleteAllFiles(path: filePath, folder: string): Promise<void> {
    
    // Deletes the user's storage folder first
    return this.storage.ref(folder).delete().toPromise()
      // Deletes the user uploads collection
      .then( () => this.database.deleteCollection(path) );
  }
}
