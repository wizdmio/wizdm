import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UnsplashPhoto, UnsplashCollection, UnsplashUser } from './unsplash.interfaces';
import { UnplashType, UnsplashCollectionsParams , UnsplashPhotosParams, UnsplashUserParams, UnsplashPhotoParams, UnsplashSearchCollectionsParams, UnsplashSearchPhotosParams, UnsplashSearchUsersParams, UnsplashRandomPhotosParams } from './unsplash.types';
import { Observable } from 'rxjs';

export let UNSPLASH_CONFIG = new InjectionToken<UnsplashConfig>('Unsplash Configuration'); 
export interface UnsplashConfig {
  location?: string,
  version?: string,
  clientId: string
}

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {

  constructor(@Inject(UNSPLASH_CONFIG) private config: UnsplashConfig, private http: HttpClient) { }

  private get location(): string {
    return this.config.location || 'https://api.unsplash.com';
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Accept-Version': `${this.config.version || 'v1'}`,
      'Authorization' : `Client-ID ${this.config.clientId}`
    });
  }

  private params(opts: any): string {
    let params = '';

    if(!!opts) {
      params = '?';
      Object.keys(opts).forEach( p => { 
        params = params + `${p}=${opts[p]};`;
      });
    }

    return params;
  }

  public user(username: string, opts?: UnsplashUserParams): Observable<UnsplashUser> {
    const url = `${this.location}/users/:${username}`;
    return this.http.get<UnsplashUser>(url + this.params(opts), { headers: this.headers });
  }

  public photo(id: string, opts?: UnsplashPhotoParams): Observable<UnsplashPhoto> {
    const url = `${this.location}/photos/:${id}`;
    return this.http.get<UnsplashPhoto>(url + this.params(opts), { headers: this.headers });
  }

  public photos(type?: UnplashType, opts?: UnsplashPhotosParams): Observable<UnsplashPhoto[]> {
    const url = `${this.location}/photos` + !!type ? `/${type}` : '';
    return this.http.get<UnsplashPhoto[]>(url + this.params(opts), { headers: this.headers });
  }

  public randomPhoto(opts?: UnsplashRandomPhotosParams): Observable<UnsplashPhoto | UnsplashPhoto[]> {
    const url = `${this.location}/photos/random`;
    return this.http.get<UnsplashPhoto | UnsplashPhoto[]>(url + this.params(opts), { headers: this.headers });
  }

  public collections(type?: UnplashType, opts?: UnsplashCollectionsParams): Observable<UnsplashCollection[]> {
    const url = `${this.location}/collections` + !!type ? `/${type}` : '';
    return this.http.get<UnsplashCollection[]>(url + this.params(opts), { headers: this.headers });
  }

  public collection(id: string, type?: UnplashType): Observable<UnsplashCollection[]> {
    const url = `${this.location}/collections/` + !!type ? `${type}/:${id}` : `:${id}`;
    return this.http.get<UnsplashCollection[]>(url, { headers: this.headers });
  }

  public collectionPhotos(id: string, type?: UnplashType, opts?: UnsplashCollectionsParams): Observable<UnsplashPhoto[]> {
    const url = `${this.location}/collections/` + !!type ? `${type}/:${id}/photos` : `:${id}/photos`;
    return this.http.get<UnsplashPhoto[]>(url + this.params(opts), { headers: this.headers });
  }

  public collectionRelated(id: string, type?: UnplashType): Observable<UnsplashCollection[]> {
    const url = `${this.location}/collections/` + !!type ? `${type}/${id}/related` : `${id}/related`;
    return this.http.get<UnsplashCollection[]>(url, { headers: this.headers });
  }

  public searchPhotos(query?: UnsplashSearchPhotosParams): Observable<UnsplashPhoto[]> {
    const url = `${this.location}/search/photos`;
    return this.http.get<UnsplashPhoto[]>(url + this.params(query), { headers: this.headers });
  }

  public searchCollections(query?: UnsplashSearchCollectionsParams): Observable<UnsplashPhoto[]> {
    const url = `${this.location}/search/collections`;
    return this.http.get<UnsplashPhoto[]>(url + this.params(query), { headers: this.headers });
  }

  public searchUsers(query?: UnsplashSearchUsersParams): Observable<UnsplashPhoto[]> {
    const url = `${this.location}/search/collections`;
    return this.http.get<UnsplashPhoto[]>(url + this.params(query), { headers: this.headers });
  }
}