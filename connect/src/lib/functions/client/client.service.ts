import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FunctionsService } from '../functions.service';
import { Observable } from 'rxjs';

/** Http cloud functions API client */
@Injectable()
export class FunctionsClient {

  constructor(readonly functions: FunctionsService, private http: HttpClient) { }

  /** Performs http GET */
  public get<T>(endPoint: string): Observable<T> {
    return this.http.get<T>(this.functions.url + endPoint);
  }

  /** Performs http POST */
  public post<T, R>(endPoint: string, data: T): Observable<R> {
    return this.http.post<R>(this.functions.url + endPoint, data);
  }

  /** Performs http PATCH */
  public patch<T, R>(endPoint: string, data: T): Observable<R> {
    return this.http.patch<R>(this.functions.url + endPoint, data);
  }

  /** Performs http DELETE */
  public delete<T>(endPoint: string): Observable<T> {
    return this.http.delete<T>(this.functions.url + endPoint);
  }
}