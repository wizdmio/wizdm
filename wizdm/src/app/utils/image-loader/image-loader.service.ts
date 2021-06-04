import { Injectable } from '@angular/core';
import { LazyImageLoader, LazyImageData, LazyLoader } from "@wizdm/lazy-image";
import { StorageService } from "@wizdm/connect/storage";
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of, concat } from 'rxjs';

@Injectable()
export class StorageImageLoader extends LazyImageLoader implements LazyLoader {

  constructor(private storage: StorageService) { super(); }

  public load(source: string): Observable<LazyImageData> {

    if(!source) { return of({} as LazyImageData); }

    return concat(

      of( this.storage.fromURL(source) ).pipe(

        switchMap( ref => ref.getMetadata() ),

        map( meta => {
          
          const { thumbnail, width, height } = meta.customMetadata; 

          return { source: thumbnail, width: +width, height: +height } as LazyImageData;
        }),

        catchError( () => of({} as LazyImageData) )
      ),

      super.load(source)
    );
  }
}
