import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DatabaseService } from '@wizdm/connect/database';
import { AuthService } from '@wizdm/connect/auth';
import { switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PostData } from '../post/post.component'

/** Resolves the post document */
@Injectable()
export class PostResolver implements Resolve<PostData> {

  constructor(private auth: AuthService, private db: DatabaseService) { }

  /** Resolves the post content loading the requested id */
  public resolve(route: ActivatedRouteSnapshot): Observable<PostData> {

    // Resolves the id from the query parameter
    const id = route.queryParamMap.get('id');

    return this.auth.user$.pipe( take(1), switchMap( user => {        

      if(!user) { return null; }

      // Loads the post data
      if(id) { return this.db.document<PostData>(`users/${user.uid}/feed/${id}`).get(); }

      // Creates a new unique document id
      const newId = this.db.col(`users/${user.uid}/feed`).doc().id;

      // Returns an empty post
      return of({ 
        id: newId,
        tags: ['public'],
        author: user.uid,
        type: 'document', content: [{ 
          type: 'paragraph', content: [{ 
            type: 'text', value: '' 
      }]}]} as PostData);
    }));      
  }
}