import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { wmUser, wmFile } from '../interfaces';
import { DatabaseService, QueryFn, Timestamp } from '../database/database.service';
import { UploaderService } from '../uploader/uploader.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfile implements wmUser {

  // User authentication token
  public user: User = null;

  // Implements wmUser
  public id      : string;
  public img     : string;
  public name    : string;
  public email   : string;
  public phone   : string;
  public birth   : string;
  public gender  : string;
  public motto   : string;
  public lang    : string;
  public color   : string;
  public cover   : string;
  public created : Timestamp;
  public updated : Timestamp;

  public lastApplication: any;

  //uploads? : any; collection reference

  constructor(private db: DatabaseService, private up: UploaderService) {}

  public asObservable(uid?: string): Observable<wmUser> {
    return this.db.document$<wmUser>(`users/${uid || this.id}`);
  }

  public init(user: User): Promise<wmUser> {
    
    // Keeps a copy of the authentication token
    this.user = user;

    // Load the user profile
    return this.asObservable(user.uid)
      .pipe( tap( user => Object.assign(this, user) ) )
        .toPromise();
  }

   // Returns true if user is logged in and profile data are available
  get authenticated(): boolean {
    return !!this.user && !!this.id;
  }

  // Email verified helper
  get emailVerified(): boolean {
    return !!this.user && this.user.emailVerified;
  }

  public create(user: User, lang?: string) {

    // Computes a minimal user profile from the authentication token
    let data = {  
      name  : user.displayName,
      email : user.email,
      phone : user.phoneNumber,
      img   : user.photoURL,
      lang  : lang
    };

    return this.db.upsert<wmUser>(`users/${user.uid}`, data);
  }

  public update(data: wmUser) : Promise<void> {
    return this.db.merge<wmUser>(`users/${this.id}`, data);
  }

  public delete() {
    // Deletes the user's uploaded files first
    return this.deleteAllFiles()
      // Deletes the user profile data next
      .then( () => this.db.delete<wmUser>(`users/${this.id}`) )
  }

  // User file management

  public loadImage(file: File): Promise<void> {
    return this.uploadFileOnce(file)
      .then( file => this.update({ img: file.url }) );
  }

  public queryUploads(queryFn?: QueryFn): Observable<wmFile[]> {
    return this.db.collection$<wmFile>(`users/${this.id}/uploads`, queryFn);
    //return this.up.queryUploads(`users/${this.id}/uploads`, queryFn);
  }

  public queryFile(id: string): Observable<wmFile> {
    return this.db.document$<wmFile>(`users/${this.id}/uploads/${id}`);
    //return this.up.queryFile(`users/${this.id}/uploads/${id}`);
  }

  public queryFileByUrl(url: string): Observable<wmFile> {
    return this.up.queryFileByUrl(`users/${this.id}/uploads`, url);
  }

  public uploadFile(file: File): Observable<wmFile> {
    return this.up.uploadFile(`users/${this.id}/uploads`, this.id, file);
  }

  public uploadFileOnce(file: File): Promise<wmFile> {
    return this.up.uploadFileOnce(`users/${this.id}/uploads`, this.id, file);
  }

  public deleteFile(id: string): Promise<void> {
    return this.up.deleteFile(`users/${this.id}/uploads/${id}`);
  }

  public deleteAllFiles(): Promise<void> {
    return this.up.deleteAllFiles(`users/${this.id}/uploads`, this.id);
  }
}