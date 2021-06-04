import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';

export interface LazyImageData {

  source : string;
  width  : number;
  height : number;
}

export interface LazyLoader {

  load(source: string): Observable<LazyImageData>;
}

@Injectable({
  providedIn: 'root'
})
export class LazyImageLoader implements LazyLoader {

  public load(source: string): Observable<LazyImageData> {

    return new Observable<LazyImageData>( subscriber => {

      const img = new Image();

      img.onerror = () => subscriber.error();

      img.onload = () => {

        subscriber.next({ source, width: img.naturalWidth, height: img.naturalHeight });
        subscriber.complete();
      }

      img.src = source;
    })
  }
}
