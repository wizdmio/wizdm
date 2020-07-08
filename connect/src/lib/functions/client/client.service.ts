import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FunctionsService } from '../functions.service';
import { Observable } from 'rxjs';

@Injectable()
export class FunctionsClient {

  constructor(readonly functions: FunctionsService, private http: HttpClient) { }

  public get<T>(endPoint: string): Observable<T> {
    return this.http.get<T>(this.functions.url + endPoint);
  }

  public post<T, R>(endPoint: string, data: T): Observable<R> {
    return this.http.post<R>(this.functions.url + endPoint, data);
  }

  public patch<T, R>(endPoint: string, data: T): Observable<R> {
    return this.http.patch<R>(this.functions.url + endPoint, data);
  }

  public delete<T>(endPoint: string): Observable<T> {
    return this.http.delete<T>(this.functions.url + endPoint);
  }
}