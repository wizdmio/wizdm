import { Injectable, Inject } from '@angular/core';
import { USER_PROFILE, wmUser, wmUserFile } from '../core-data';
import { DatabaseService, QueryFn } from '../database/database.service';
import { StorageService } from '../storage/storage.service';
import { Observable, merge } from 'rxjs';
import { switchMap, map, tap, filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(@Inject(USER_PROFILE) 
              private profile  : wmUser,
              private database : DatabaseService,
              private storage  : StorageService) { }

  private get uploadRef(): string {
    return `users/${this.profile.id}/uploads`;
  }

  public queryUserUploads(queryFn?: QueryFn): Observable<wmUserFile[]> {
    return this.database.colWithIds$<wmUserFile>(this.uploadRef, queryFn);
  }

  public queryUserFile(id: string): Observable<wmUserFile> {
    return this.database.docWithId$<wmUserFile>(`${this.uploadRef}/${id}`);
  }

  public addUserUploads(data: wmUserFile): Promise<string> {
    return this.database.add<wmUserFile>(this.uploadRef, data);
  }

  private unique(name: string): string {
    return `new Date().getTime()}_${name}`;
  }

  /**
   * Uploads a file into the user's upload area
   * @param file the file object to be uploaded and tracked into the user's uploads area
   * @returns the StorageTaskSnapshot observable to track the process
   */
  public uploadUserFile(file: File): Observable<wmUserFile> {

    // Computes the storage path
    const path = `${this.profile.id}/${this.unique(file.name)}`;

    // Creates the upload task
    let task = this.storage.upload(path, file);

    // Merges two snapshotChanges observables
    return merge(

      // During the transfer, maps the snapshot to a wmUserFile tracking the progress in xfer
      // with a simple map, this allow for minimized latency and better progress preview
      task.snapshotChanges().pipe( 
        map( snap => { 
          return { 
            name: file.name,
            fullName: snap.ref.name,
            path,
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
          const result: wmUserFile = {
            name: file.name,
            fullName: snap.ref.name,
            path,
            size: snap.totalBytes,
          };
          
          // Gets the download url
          return snap.ref.getDownloadURL()
            // Saves the uploaded file information into the user uploads area
            .then( url => 
              this.addUserUploads({ ...result, url })
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
  public uploadUserFileOnce(file: File): Promise<wmUserFile> {
    return this.uploadUserFile(file).toPromise();
  }

  /**
   * Deletes a user uploaded file clearing up both the storage and the user's uploads area
   */
  public deleteUserFile(id: string): Promise<void> {
    
    let ref = this.database.doc(`${this.uploadRef}/${id}`);
    return this.database.doc$<wmUserFile>(ref)
      .pipe( 
        take(1),
        switchMap( file => this.storage.ref(file.path).delete() ),
        tap( () => ref.delete() )
      ).toPromise();
  }

  public deleteAllUserFiles(): Promise<void> {
    
    // Deletes the user's storage folder first
    return this.storage.ref(`${this.profile.id}`).delete().toPromise()
      // Deletes the user uploads collection
      .then( () => this.database.deleteCollection(this.uploadRef) );
  }
}
