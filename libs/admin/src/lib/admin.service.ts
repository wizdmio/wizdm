import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRecord, UserUpdate, UserIdentifier } from './admin-types';
import { Observable } from 'rxjs';

export const ADMIN_END_POINT = new InjectionToken<string>('wizdm.admin.endpoint');

/** wizdm user's admin service */
@Injectable()
export class AdminService {

  constructor(private http: HttpClient, @Inject(ADMIN_END_POINT) private endPoint: string) {

    // Gets rid of the trailing slash, if any
    this.endPoint = endPoint.replace(/\/+$/, '');
  }

  /** List all users returning them in ascending order sorted by uid */
  public listAllUsers(): Observable<UserRecord[]> {

    return this.http.get<UserRecord[]>(this.endPoint + '/users');
  }

  /** List users based on idntifiers (uid, email, phone... */
  public listUsers(identifiers: UserIdentifier[]): Observable<UserRecord[]> {

    return this.http.post<UserRecord[]>(this.endPoint + '/users', identifiers);
  }

  /** Adds a new user */
  public addUser(data: UserUpdate): Observable<UserRecord> {

    return this.http.post<UserRecord>(`${this.endPoint}/users/new`, data);
  }

  /** Reads a user record */
  public getUser(uid: string): Observable<UserRecord> {

    return this.http.get<UserRecord>(`${this.endPoint}/users/${uid}`);
  }

  /** Updates a user record */
  public updateUser(uid: string, data: UserUpdate): Observable<UserRecord> {

    return this.http.patch<UserRecord>(`${this.endPoint}/users/${uid}`, data);
  }

  /** Deletes a user */
  public deleteUser(uid: string): Observable<UserRecord> {

    return this.http.delete<UserRecord>(`${this.endPoint}/users/${uid}`);
  }
}
