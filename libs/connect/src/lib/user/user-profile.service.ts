import { Injectable, OnDestroy } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { DatabaseDocument, dbCommon } from '../database/database-document';
import { AuthService, UserExtension, User } from '../auth/auth.service';
import { UploaderService } from '../uploader/uploader.service';
import { Observable, Subscription, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface wmUser extends dbCommon {

  img?     : string,
  name?    : string,
  email?   : string,
  phone?   : string,
  birth?   : string,
  gender?  : string,
  motto?   : string,
  lang?    : string,
  color?   : string,
  cover?   : string
}

@Injectable()
export class UserProfile<T extends wmUser = wmUser> extends DatabaseDocument<T> implements OnDestroy, UserExtension {

  // User authentication token
  public user: User = null;
  public data: T = <T>{};

  private sub: Subscription;

  constructor(db: DatabaseService, readonly auth: AuthService, readonly uploads: UploaderService) {
    super(db, '/users', '');

    // Extends AuthService user functionalities to create/destroy the user profile
    // togheter with the user account
    this.auth.extendUser(this);

    // Subscribe to the observable to keep the profile information in sync
    this.sub = this.asObservable()
      .subscribe( profile => {

        // Resets the profile data when logging out
        if(!profile) { this.data = <T>{}; return; }

        // Initialize the user's uploader
        this.uploads.init(`/users/${this.id}/uploads`, this.id);

        // Sync the profile data on log-in
        this.data = profile;
      });
  }

  // Implements AuthService.UserExtension onUserCreate()
  public onUserCreate(user: User): boolean | Promise<boolean> {
    
    console.log('Creating new user profile: ', user.uid);

    // Create a new user profile whenever a new user account is created
    return this.create(user, this.auth.language)
      .then( () => true );
  }

  private create(user: User, lang?: string) {

    // Computes a minimal user profile from the authentication token
    const data = <T>{
      name  : user.displayName,
      email : user.email,
      phone : user.phoneNumber,
      img   : user.photoURL,
      lang  : lang || 'en'
    };

    return this.upsert(data);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public asObservable(): Observable<T|null> {

    return this.auth.user$.pipe(
      switchMap( user => {
        // Keeps a copy of the authentication token
        this.user = user;
        // Initialize the document id
        this.id = !!user ? user.uid : null;
        // Streams the document data
        return !!user ? this.stream() : of(null);
      })
    );
  }

  get authenticated$(): Observable<boolean> {
    return this.asObservable().pipe( map( profile => !!profile ) );
  }

  // Returns true if user is logged in and profile data are available
  get authenticated(): boolean {
    return !!this.user && !!this.data;
  }

  // Email verified helper
  get emailVerified(): boolean {
    return !!this.user && this.user.emailVerified;
  }

  public loadImage(file: File): Promise<void> {
    return this.uploads.uploadOnce(file)
      .then( file => this.update(<T>{ img: file.url }));
  }

  public delete(): Promise<void> {
    // Deletes the user's uploaded files first
    return this.uploads.deleteAll()
      // Deletes the user profile data next
      .then( () => super.delete() )
  }

  // Implements AuthService.UserExtension onUserDelete()
  public onUserDelete(user: User): boolean | Promise<boolean> {
    
    console.log('Wiping user profile for: ', user.uid);
    
    if( user.uid !== this.id ){
      return false;
    }

    // Deletes the user profile returning true so AuthService will proceed deleting the user account
    return this.delete().then( () => true );
  }
}